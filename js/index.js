;(function (w, d) {
	var page = {
		init: function () {
			//获取购物车中的节点
			this.$cartContent = $('.cart-content')
			this.$cartBox = $('.cart-box')
			this.$cartCountNum = $('.cart_count_num')
			//获取搜索输入框 和 提交按钮
			this.$searchInput = $('.search-input')
			this.$searchBtn = $('.search-btn')
			//获取搜索结果显示层
			this.$searchLayer = $('.search-layer')
			//获取一级分类父节点
			this.$categories = $('.categories')
			//获取一级分类节点
			this.$parentCategories = $('.parent-categories')
			//获取一级分类中的所有子节点
			this.$parentCategoriesItem = null
			//获取二级分类节点
			this.$childCategories = $('.child-categories')
			//获取轮播图容器节点
			this.$swiper = $('#swiper')
			//获取热销商品容器节点
			this.$hotProductList = $('.hot .product-list')
			//获取楼层容器节点
			this.$floor = $('.floor')
			//获取电梯容器节点
			this.$elevator = $('#elevator')
			//获取电梯每一项
			this.$elevatorItems = null
			//获取电梯的floor楼层的DOM节点
			this.$floorsList = null

			//搜索防抖定时器
			this.searchTimer = null
			//购物车防抖定时器
			this.cartTimer = null
			//分类列表防抖定时器
			this.categoryTimer = null
			this.childCategoriesCache = {}
			//电梯索引
			this.eleavtorIndex = 0
			//电梯防抖定时器
			this.elevatorTimer = null

			//处理加载购物车方法
			this.handelCart()

			//处理搜索的方法
			this.handelSearch()
			
			//处理分类列表方法
            this.handleCategories()

            //处理轮播图方法
            this.handleCarousel()
            
            //处理热销商品方法
            this.handleHotProductList()

            //处理楼层方法 和 处理电梯方法
            this.handelFloor()
            
            //处理电梯方法
            this.handelElevator()
           
		},
		//处理购物车方法
		handelCart() {
			let that = this
			that.loadCartsCount()
			that.$cartBox.on('mouseenter', () => {
				if (that.cartTimer) {
					clearTimeout(that.cartTimer)
				}
				that.cartTimer = setTimeout(function () {
					//cartContent显示
					that.$cartContent.show()
					that.$cartContent.html('<div class="loader"></div>')
					//ajax请求数据
					utils.ajax({
						url: '/carts',
						success(res) {
							that.renderCart(res)
						},
						error(status, e) {
							console.log(status, e)
							that.$cartContent.html(
								'<span class="empty-cart">出错了，请稍后再试！</span>'
							)
						},
					})
				}, 300)
			})

			that.$cartBox.on('mouseleave', () => {
                if (this.cartTimer) {
                    clearTimeout(this.cartTimer)
                }
				that.$cartContent.hide()
			})
		},
		//加载购物车数量方法
		loadCartsCount() {
			let that = this
			utils.ajax({
				url: '/carts/count',
				success: function (data) {
					that.$cartCountNum.html(data.data)
				},
				error: function (status) {
					console.log(status)
				},
			})
		},
		//渲染购物车方法
		renderCart(data) {
			let that = this
			let cartList = data.data.cartList
			let len = cartList.length
			let totalPrice = data.totalPrice
			let html = ''
			if (len > 0) {
				html += `
            <span class="cart-tip">最近加入的宝贝</span>
            <ul>`
				for (let i = 0; i < len; i++) {
					html +=
						`<li class="cart-item clearfix">
                    <a href="javascript:;">
                        <img src="` +
						cartList[i].product.mainImage +
						`">
                        <span class="text-ellipsis">` +
						cartList[i].product.name +
						`</span>
                    </a>
                    <span class="product-count">x ` +
						cartList[i].count +
						`</span><span class="product-price">` +
						cartList[i].totalPrice +
						`</span>
                </li>`
				}
				html += `</ul>
            <span class="line"></span>
            <a href="/cart.html" class="btn cart-btn">查看我的购物车</a></ul>`
				that.$cartContent.html(html)
			} else {
				that.$cartContent.html(
					'<span class="empty-cart">购物车中还没有商品,赶紧来购买吧!</span>'
				)
			}
		},

        //处理搜索方法
        handelSearch() {
            $('.search-box').search({
                searchBtnSelector:'.search-btn',
                searchInputSelector:'.search-input',
                searchLayerSelector:'.search-layer',
                isAutocomplete:true
            })
        },

		//处理分类列表方法
		handleCategories:function(){
            var _this = this
            //获取父级分类
            this.getParentCategoriesData()
            //用事件委托处理父级分类项目的切换
            this.$categories
            .on('mouseover','.parent-categories-item',function(){
                var $elem = $(this)
                if (_this.categoriesTimer) {
                    clearTimeout(_this.categoriesTimer)
                }
                $elem.addClass('active').siblings().removeClass('active')
                _this.categoriesTimer = setTimeout(function () {
                    _this.$childCategories.show()
                    var pid = $elem.data('id')
                    //判断缓存中是否有数据
                    if (_this.childCategoriesCache[pid]){
                        _this.renderChildCategories(_this.childCategoriesCache[pid])
                    }else{
                        _this.getChildCategoriesData(pid)
                    }
                },300)
            })
            .on('mouseleave',function(){
                if (_this.categoriesTimer) {
                    clearTimeout(_this.categoriesTimer)
                }
                _this.$childCategories.hide().html('')
                _this.$parentCategories.find('.parent-categories-item').removeClass('active')
            })
        },
		//获取父级一级分类数据
		getParentCategoriesData:function(){
            var _this = this
            utils.ajax({
                url:'/categories/arrayCategories',
                success:function(data){
                    if(data.code == 0){
                        _this.renderParentCategories(data.data)
                    }
                }
            })
        },
		//渲染一级分类列表
		renderParentCategories:function(list){
            var len = list.length
            if(len > 0){
                var html = '<ul>'
                for(var i = 0;i<len;i++){
                    html += '<li class="parent-categories-item" data-id="'+list[i]._id+'" data-index="'+i+'">'+list[i].name+'</li>'
                }
                html += '</ul>'
                this.$parentCategories.html(html)
            }
        },
		
		//获取二级分类数据
		getChildCategoriesData:function(pid){
            var _this = this
            this.$childCategories.html('<div class="loader"></div>') 
            utils.ajax({
                url: '/categories/childArrayCategories',
                data:{
                    pid:pid
                },
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderChildCategories(data.data)
                       //缓存数据
                        _this.childCategoriesCache[pid] = data.data
                    }
                }
            })
        },
		//渲染二级分类列表
		renderChildCategories:function(list){
            var len = list.length
            if(len > 0){
                var html = '<ul>'
                for (var i = 0; i < len; i++) {
                    html += `<li class="child-item">
                                <a href="#">
                                    <img src="${list[i].mainImage}" alt="">
                                    <p>${list[i].name}</p>
                                </a>
                            </li>`
                }
                html += '</ul>'
                this.$childCategories.html(html)
            }
        },
        

		//处理轮播图方法
        handleCarousel:function(){
            var _this = this
            utils.ajax({
                url:'/ads/positionAds',
                data:{
                    position:1
                },
                success:function(data){
                    if(data.code == 0){
                        _this.renderCarousel(data.data)
                    }
                }
            })
        },
		//渲染轮播图
		renderCarousel:function(list){
            var imgs = list.map(function(item){
                return item.imageUrl
            })
            this.$swiper.carousel({
                imgs:imgs,
                width: 800,
                height: 440,
                playInterval: 0,
                type:'slide'
            })
        },

        //处理热销方法
        handleHotProductList: function() {
            let _this = this
            
            //判断是否在可视区，在可视区才请求数据
            _this.$hotProductList.betterFn = utils.debounce(function() {
                
                if (utils.isVisibility(_this.$hotProductList)) {
                    //在可视区
                    utils.ajax({
                        url: "/products/hot",
                        success: function (res) {
                            if (res.code == 0) {
                                _this.renderHotProductList(res.data)
                            }
                        }
                    })
                }
            },300)
            $(window).on('scroll resize load', _this.$hotProductList.betterFn)
        },

        //渲染热销商品模块
        renderHotProductList: function (list) {
            let _this = this
            let html = ''
            for(var i = 0,len = list.length;i<len;i++){
                html += `<li class="product-item col-1 col-gap">
                            <a href="#">
                                <img width="180px" height="180px" data-src="${list[i].mainImage}" src="./images/lazyLoad.gif" alt="">
                                <p class="product-name">${list[i].name}</p>
                                <p class="product-price-paynum">
                                    <span class="product-price">&yen;${list[i].price}</span>
                                    <span class="paynum">${list[i].payNums}人已购买</span>
                                </p>
                            </a>
                        </li>`
            }
            _this.$hotProductList.html(html)
            //解除事件的绑定
            $(window).off('scroll resize load', _this.$hotProductList.betterFn)
            //图片请求加载完成后再替换src属性
            _this.$hotProductList.find('.product-item img').each((i,v)=>{
                let imgSrc = $(v).data('src')
                utils.loadImage(imgSrc, function () {
                    $(v).attr('src',imgSrc)
                })
            })
            
        },

		//处理楼层方法
		handelFloor() {
            let that = this
            //防抖处理
            that.$floor.betterFn = utils.debounce(function() {
                //在可视区内
                if (utils.isVisibility(that.$floor)) {
                    utils.ajax({
                        url: '/floors',
                        success(res) {
                            //渲染楼层
                            that.renderFloor(res.data)
                        },
                    })
                }
                
            },300)
			
            $(window).on('scroll resize load', that.$floor.betterFn)
		},
		//渲染楼层和电梯
		renderFloor(pList) {
			let that = this
			let html = ''
			let elevator = ''
			let len = pList.length
			for (let i = 0; i < len; i++) {
				elevator += `
                    <a href="javascript:;" class="elevator-item">
                        <span class="elevator-item-num">F${i+1}</span>
                        <span class="elevator-item-text text-ellipsis" data-num="${i}">${pList[i].title}</span>
                    </a>
                    `
				html += `
                <div class="f${i - 0 + 1} clearfix floor-wrap f">
				<div class="floor-title">
					<a href="#" class="link">
						<h2>F${i - 0 + 1} ${pList[i].title}</h2>
					</a>
				</div>
                <ul class="floor-list">
                `
				for (let j = 0; j < pList[0].products.length; j++) {
					html += `
					<li class="floor-item clo-1">
						<a href="#"><img src="./images/lazyLoad.gif" data-src="${pList[i].products[j].mainImage}" alt="" /></a>
						<p class="product-name">
                        ${pList[i].products[j].name}
						</p>
						<p class="product-price-box">
							<span class="product-price">&yen;${pList[i].products[j].price}</span
							><span class="product-num">${pList[i].products[j].payNums}人已购买</span>
						</p>
                    </li>`
				}
            }
            html += `</ul>
                </div>`
                
            elevator += `<a href="javascript:;" class="backToTop" >
                <span class="elevator-item-num"><i class="iconfont icon-arrow-up"></i></span>
                <span class="elevator-item-text text-ellipsis bk" id="backToTop">顶部</span>
                </a>`

            that.$floor.html(html)
            that.$elevator.html(elevator)
            $(window).off('scroll resize load', that.$floor.betterFn)
            that.loadImage()
        },
        loadImage() {
            let _this = this
            let $floors = _this.$floor.find('.floor-wrap')
            let loadNUm = 0
            let allNum = $floors.length
            var betterFn = utils.debounce(function () {
                $floors.each(function() {
                    let $floor = $(this)
                    if ($floor.data('isload')) {
                        return
                    }
                    if (utils.isVisibility($floor)) {
                        let $imgs = $floor.find('img')
                        $imgs.each(function() {
                            var $img = $(this)
                            var imgSrc = $img.data('src')
                            utils.loadImage(imgSrc, function () {
                                $img.attr('src',imgSrc)
                            })
                        })
                        $floor.data('isload', true)
                        loadNUm++
                        if (loadNUm == allNum) {
                            //解除绑定的事件
                            $(window).off('scroll resize load', betterFn)
                        }
                    }
                })
            },300)
            $(window).on('scroll resize load', betterFn)
        },



		//处理电梯点击 鼠标滚动
		handelElevator() {
            let that = this
            //点击电梯
            that.$elevator.on('click', '.elevator-item-text', function () {
                var $elem = $(this)
                if ($elem.attr('id') == 'backToTop') {
                    //如果有id 是回顶部
                    $('html, body').animate({
                        scrollTop: 0
                    })
                } else {
                    //回到楼层指定楼层
                    //获取索引
                    var num = $elem.data('num')
                    $('html, body').animate({
                        scrollTop: $('.floor-wrap').eq(num).offset().top
                    })
                }
            })
        
            //防抖处理 滚动滑到指定楼层
            var bettleElevatorFn = utils.debounce(function () {
                that.setElevator()
            },300)

            $(window).on('scroll resize load', bettleElevatorFn)
        },
       
        setElevator(){
            let that = this
            let num = that.getNum()
            if (num == -1) {
                that.$elevator.hide()
            } else {
                that.$elevator.show()
                .find('.elevator-item')
                .removeClass('elevator-active')
                .eq(num).addClass('elevator-active')
                
            }
        },
        getNum(){
            var num = -1
            $('.floor-wrap').each(function (index) {
                num = index
                var $elem = $(this)
                if ($elem.offset().top > $(window).scrollTop() + $(window).height()/2) {
                    num = index - 1
                    return false
                }
            })
            return num
        }
        
	}
	page.init()
})(window, document)

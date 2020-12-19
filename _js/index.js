;(function (w, d) {
	var page = {
		init: function () {
			//获取购物车中的节点
			this.cartContent = d.querySelector('.cart-content')
			this.cartBox = d.querySelector('.cart-box')
			this.cartCountNum = d.querySelector('.cart_count_num')
			//获取搜索输入框 和 提交按钮
			this.searchInput = d.querySelector('.search-input')
			this.searchBtn = d.querySelector('.search-btn')
			//获取搜索结果显示层
			this.searchLayer = d.querySelector('.search-layer')
			//获取一级分类父节点
			this.categories = d.querySelector('.categories')
			//获取一级分类节点
			this.parentCategories = d.querySelector('.parent-categories')
			//获取一级分类中的所有子节点
			this.parentCategoriesItem = null
			//获取二级分类节点
			this.childCategories = d.querySelector('.child-categories')
			//获取轮播图容器节点
			this.swiper = d.querySelector('#swiper')
			//获取热销商品容器节点
			this.HotproductList = d.querySelector('.hot .product-list')
			//获取楼层容器节点
			this.floor = d.querySelector('.floor')
			//获取电梯容器节点
			this.elevator = d.querySelector('#elevator')
			//获取电梯每一项
			this.elevatorItems = null
			//获取电梯的floor楼层的DOM节点
			this.floorsList = null

			//搜索防抖定时器
			this.searchTimer = null
			//分类列表防抖定时器
			this.categoryTimer = null
			//一级分类列表last索引
			this.lastCateIndex = 0
			//电梯索引
			this.eleavtorIndex = 0
			//电梯防抖定时器
			this.elevatorTimer = null

			//处理加载购物车方法
			this.handelCart()
			//处理搜索的方法
			this.handelSearch()
			//处理分类列表方法
			this.handelCategories()
			//处理轮播图方法
			this.handelSwiper()
			//处理热销商品方法
			this.handelHotProduct()
			//处理楼层方法 和 处理电梯方法
			this.handelFloor()
		},
		//处理购物车方法
		handelCart() {
			let that = this
			that.loadCartsCount()
			that.cartBox.addEventListener('mouseenter', () => {
				//cartContent显示
				utils.show(that.cartContent)
				that.cartContent.innerHTML = '<div class="loader"></div>'
				//ajax请求数据
				utils.ajax({
					url: '/carts',
					success(res) {
						console.log(res)
						that.renderCart(res)
					},
					error(status, e) {
						console.log(status, e)
						that.cartContent.innerHTML =
							'<span class="empty-cart">出错了，请稍后再试！</span>'
					},
				})
			})

			that.cartBox.addEventListener('mouseleave', () => {
				utils.hide(that.cartContent)
			})
		},
		//加载购物车数量方法
		loadCartsCount() {
			let that = this
			utils.ajax({
				url: '/carts/count',
				success: function (data) {
                    
					that.cartCountNum.innerHTML = data.data
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
				that.cartContent.innerHTML = html
			} else {
				that.cartContent.innerHTML =
					'<span class="empty-cart">购物车中还没有商品,赶紧来购买吧!</span>'
			}
		},

		//处理搜索方法
		handelSearch() {
			let that = this
			//搜索按钮绑定点击事件
			that.searchBtn.addEventListener('click', () => {
				that.submitSearch()
			})
			//监听input输入事件
			that.searchInput.addEventListener('input', () => {
				if (that.searchTimer) {
					w.clearTimeout(that.searchTimer)
				}
				let val = that.searchInput.value
				that.searchTimer = setTimeout(() => {
					//获取搜索的数据方法的调用
					that.getSearchData(val)
				}, 200)
			})
			//input失去焦点
			d.addEventListener('click', () => {
				that.isShowSearchLayer()
			})

			//input获取焦点
			that.searchInput.addEventListener('click', (e) => {
				e.stopPropagation()
				let inner = that.searchLayer.innerText
				that.isShowSearchLayer(inner)
			})
			//搜索层 search-item 绑定点击事件
			that.searchLayer.addEventListener('click', (e) => {
				let keywords = e.target.innerText
				that.searchInput.value = keywords
				that.submitSearch()
			})
		},
		//获取搜索数据
		getSearchData(val) {
			let that = this
			let keywords = val
			if (keywords) {
				utils.ajax({
					url: '/products/search',
					data: {
						keywords,
					},
					success(res) {
						that.renderSearchLayer(res)
					},
					error(err) {
						console.log(err)
					},
				})
			} else {
				that.isShowSearchLayer()
			}
		},
		//渲染搜索层
		renderSearchLayer(data) {
			let that = this
			let searchList = data.data
			let len = searchList.length
			let html = ''
			if (len > 0) {
				for (let i = 0; i < len; i++) {
					html +=
						'<li class="search-item">' +
						searchList[i].name +
						'</li>'
				}
			}
			that.searchLayer.innerHTML = html
			that.isShowSearchLayer(html)
		},
		//是否渲染搜索层
		isShowSearchLayer(inner) {
			let that = this
			if (inner) {
				utils.show(that.searchLayer)
			} else {
				utils.hide(that.searchLayer)
			}
		},
		//搜索提交方法
		submitSearch() {
			let that = this
			let keywords = that.searchInput.value
			w.location.href = './allcom-index.html?keywords=' + keywords
		},

		//处理分类列表方法
		handelCategories() {
			//获取一级分类数据方法
			this.getParentCategoriesData()
			//绑定鼠标移入移出事件
			this.bindChildrenMouseOver()
			this.bindChildrenMouseOut()
		},
		//获取父级一级分类数据
		getParentCategoriesData() {
			let that = this
			utils.ajax({
				url: '/categories/arrayCategories',
				success(res) {
					//渲染一级分类列表
					that.renderParentCategory(res)
				},
			})
		},
		//渲染一级分类列表
		renderParentCategory(data) {
			let that = this
			let parentCategories = data.data
			let len = parentCategories.length
			let html = ''
			if (len > 0) {
				html += '<ul>'
				for (let i = 0; i < len; i++) {
					html +=
						'<li class="parent-categories-item" data-index="' +
						i +
						'" data-id="' +
						parentCategories[i]._id +
						'">' +
						parentCategories[i].name +
						'</li>'
				}
				html += '</ul>'
			}
			that.parentCategories.innerHTML = html
			that.parentCategoriesItem = d.querySelectorAll(
				'.parent-categories-item'
			)
		},
		//一级分类绑定鼠标移入事件
		bindChildrenMouseOver() {
			let that = this
			that.parentCategories.addEventListener('mouseover', (e) => {
				if (that.categoryTimer) {
					clearTimeout(that.categoryTimer)
				}
				that.categoryTimer = setTimeout(() => {
					if (e.target.className === 'parent-categories-item') {
						//获取自定义属性的 id 和 索引
						let id = e.target.getAttribute('data-id')
						let index = e.target.getAttribute('data-index') - 0
						//根据索引 做tab栏切换效果
						that.parentCategoriesItem[index].className =
							'parent-categories-item active'
						that.parentCategoriesItem[
							that.lastCateIndex
						].className = 'parent-categories-item'
						that.lastCateIndex = index
						//获取二级分类数据
						that.getChildrenCategoriesData(id)
					}
				}, 100)
			})
		},
		// 一级分类绑定鼠标移出事件
		bindChildrenMouseOut() {
            let that = this
            if (!that.parentCategoriesItem) {
                return
            }
			that.categories.addEventListener('mouseleave', (e) => {
				// 清除鼠标悬浮设置的定时器
				if (that.categoryTimer) {
					clearTimeout(that.categoryTimer)
				}
				//隐藏二级分类列表
				utils.hide(that.childCategories)
				//二级分类列表内容置空
				that.childCategories.inner = ''
				//一级分类中的tab栏效果清空
				that.parentCategoriesItem[that.lastCateIndex].className =
					'parent-categories-item'
			})
		},
		//获取二级分类数据
		getChildrenCategoriesData(id) {
			let pid = id
			let that = this
			//显示右侧二级分类面板
			utils.show(that.childCategories)
			//请求数据之前 显示等待loader图标
			that.childCategories.innerHTML = '<div class="loader"></div>'
			utils.ajax({
				url: '/categories/childArrayCategories',
				data: {
					pid,
				},
				success(res) {
					//渲染二级分类列表
					that.renderChildrenCategory(res)
				},
			})
		},
		//渲染二级分类列表
		renderChildrenCategory(data) {
			let that = this
			let childrenCategories = data.data
			let len = childrenCategories.length
			let html = ''
			if (len > 0) {
				html += '<ul>'
				for (let i = 0; i < len; i++) {
					html += `
                        <li class="child-item">
                            <a href="javascript:;">
                                <img src="${childrenCategories[i].mainImage}">
                                <p>${childrenCategories[i].name}</p>
                            </a>
                        </li>`
				}
				html += '</ul>'
			}
			that.childCategories.innerHTML = html
		},

		//处理轮播图方法
		handelSwiper() {
			let that = this
			utils.ajax({
				url: '/ads/positionAds',
				data: {
					position: 1,
				},
				success(res) {
					that.renderSwiper(res)
				},
			})
		},
		//渲染轮播图
		renderSwiper(data) {
			let swiperList = data.data
			let imgs = swiperList.map((item) => item.image)
			new SlideCarousel({
				id: 'swiper',
				imgs: imgs,
				width: 862,
				height: 440,
				playInterval: 2000,
			})
		},

		//处理热销商品方法
		handelHotProduct() {
			let that = this
			utils.ajax({
				url: '/products/hot',
				success(res) {
					if (res.code == 0) {
						that.renderHotProduct(res.data)
					}
				},
			})
		},
		//渲染热销商品
		renderHotProduct(data) {
			let that = this
			let html = ''
			let len = data.length
			for (let i = 0; i < len; i++) {
				html += `
               <li class="product-item clo-1">
					<a href="#" class=""
						><img src="${data[i].mainImage}" alt="" />
						<p class="product-name">
							${data[i].name}
						</p>
						<p class="product-price-box">
							<span class="product-price">&yen;${data[i].price}</span
							><span class="product-num">${data[i].payNums}人已经购买</span>
						</p>
					</a>
				</li>
               
               `
			}
			that.HotproductList.innerHTML = html
		},

		//处理楼层方法
		handelFloor() {
			let that = this
			utils.ajax({
				url: '/floors',
				success(res) {
                    //渲染楼层
					that.renderFloor(res.data)
				},
			})
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
                <div class="f${i - 0 + 1} clearfix f">
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
						<a href="#"><img src="${pList[i].products[j].mainImage}" alt="" /></a>
						<p class="product-name">
                        ${pList[i].products[j].name}
						</p>
						<p class="product-price-box">
							<span class="product-price">&yen;${pList[i].products[j].price}</span
							><span class="product-num">${pList[i].products[j].payNums}人已购买</span>
						</p>
                    </li>`
				}
				html += `</ul>
                </div>`
            }
            //置顶按钮
			elevator += `<a href="javascript:;" class="backToTop" >
            <span class="elevator-item-num"><i class="iconfont icon-arrow-up"></i></span>
            <span class="elevator-item-text text-ellipsis bk" id="backToTop">顶部</span>
            </a>`
			//楼层
			that.floor.innerHTML = html
			//电梯
			that.elevator.innerHTML = elevator

			that.floorsList = d.querySelectorAll('.floor .f')
			that.elevatorItems = d.querySelectorAll('.elevator-item')
			//处理电梯的事件
			that.handelElevator()
		},

		//处理电梯点击 鼠标滚动
		handelElevator() {
			let that = this
			//电梯点击事件
			that.elevator.addEventListener('click', (e) => {
				if (e.target.className === 'elevator-item-text text-ellipsis') {
					//获取索引
                    let index = e.target.getAttribute('data-num') - 0
                    if (!that.floorsList) {
                        return
                    }
					//设置文档位置跟随移动
					let top = that.floorsList[index].offsetTop
					d.documentElement.scrollTop = top
				} else if (e.target.className === 'elevator-item-text text-ellipsis bk') {
					d.documentElement.scrollTop = 0
				}
			})
			//鼠标滚动事件
			w.addEventListener('scroll', that.betterSetElevator.bind(that), false)
			w.addEventListener('resize', that.betterSetElevator.bind(that), false)
			w.addEventListener('load', that.betterSetElevator.bind(that), false)
        },
        //防抖处理
        betterSetElevator(){
            let that=this
            if (that.elevatorTimer) {
                clearTimeout(that.elevatorTimer)
            }
            that.elevatorTimer = setTimeout(function(){
                that.setElevator()
            },80)
        },
        setElevator(){
            let that = this
            if (!that.elevatorItems) {
                return
            }
            let num = that.getNum()
            if (num == -1) {
                utils.hide(that.elevator)
            } else {
                utils.show(that.elevator)
                for (let i=0; i < that.elevatorItems.length; i++) {
                    if (num == i) {
                        that.elevatorItems[i].className = 'elevator-item elevator-active'
                    } else {
                        that.elevatorItems[i].className = 'elevator-item'
                    }
                }
            }
        },
        getNum(){
            let that = this
            if (!that.floorsList) {
                return num
            }
            let num = -1
            for (let i=0,len=that.floorsList.length; i < len; i++) {
                num = i
                if (that.floorsList[i].offsetTop >= d.documentElement.scrollTop  + d.documentElement.clientHeight/2) {
                    num = i - 1
                    break
                }
            }
            return num
        }
        
	}
	page.init()
})(window, document)

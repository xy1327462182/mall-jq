//引入模块
const express = require('express');
const Mock = require('mockjs');
//创建服务器
const app = express()

//处理跨域
app.use((req, res, next) => {
    res.append("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Credentials", true);
    res.append("Access-Control-Allow-Methods", "GET, POST, PUT,DELETE");
    res.append("Access-Control-Allow-Headers", "Content-Type, X-Requested-With,X-File-Name");
    next();
})

//处理路由
//购物车数据
app.get('/carts/count', (req, res)=>{
    res.json(Mock.mock({
		code: 0,
		'data|1-20': 1,
	}))
})
app.get('/carts', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data": {
            "allChecked": "@boolean",
            "totalCartPrice|1-9999": 1,
            "_id": "@string('lower',24)",
            "cartList|0-10": [
                {
                    "count|1-10": 1,
                    "totalPrice|1-9999": 1,
                    "checked": "@boolean",
                    "_id": "@string('lower',24)",
                    "product": {
                        "_id": "@string('lower',24)",
                        "name": "@cword(3, 120)",
                        "mainImage": "@image('200x200',@color())",
                        "price|1-9999": 1,
                        "stock|1-9999": 1
                    },
                    "attr": "颜色:白色;"
                }
            ]
        }
    }))
})
// 搜索部分数据
app.get('/products/search', (req, res)=>{
    res.json(Mock.mock({
		code: 0,
		'data|0-8': [
            {
                _id: "@string('lower',24)",
			    name: '@cword(3, 120)'
            }
        ]
	}))
})

//一级分类数据
app.get('/categories/arrayCategories', (req, res)=>{
    res.json(Mock.mock({
		code: 0,
		'data|10': [
            {
                "level": 1,
                _id: "@string('lower',24)",
			    name: '@cword(4)'
            }
        ],
	}))
})

//二级分类数据
app.get('/categories/childArrayCategories', (req, res)=>{
    res.json(Mock.mock({
		code: 0,
		'data|1-15': [
            {
                "level": 2,
                _id: "@string('lower',24)",
                name: '@cword(2,4)',
                mainImage: "@image('200x200',@color())",
				'price|1-9999': 1,
            }
        ],
	}))
})

//轮播图数据
app.get('/ads/positionAds', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|3-7": [
            {
                "position": "1",
                "order": 0,
                "isShow": "1",
                "_id": "@string('lower',24)",
                "name": "@word(4)",
                "imageUrl": "@image('862x440',@color())",
                "link": "http://mall.kuazhu.com/detail.html?productId=5ea68e9e5dbe7a0023712b03"
            },
        ]
    }))
})

//热销商品数据
app.get('/products/hot', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|4": [
            {
                "order": 0,
                "isShow": "1",
                "isHot": "1",
                "payNums|1-9999": 0,
                "_id": "@string('lower',24)",
                "name": "@cword(3, 120)",
                "mainImage": "@image('200x200',@color())",
                "price|1-9999": 1
            }
        ]
    }))
})

//楼层数据
app.get('/floors', function (req, res) {
    res.json(Mock.mock({
        code: 0,
		'data|4': [
            {
                "title": "@cword(4)",
                "id": "@string('lower',24)",
                "order": 0,
                "num|+1": 1,
                "products|10": [
                        {
                            "status": "1",
                            "order": 0,
                            "isShow": "1",
                            "isHot": "1",
                            "payNums|0-1000": 0,
                            "_id": "@string('lower',24)",
                            "name": '@cword(3, 30)',
                            "mainImage": "@image('200x200',@color())",
                            'price|1-5999': 1,
                            "stock|1-900": 1,
                        },
                ]
            }
        ]
    }))
})

//监听端口
app.listen('3000', ()=>{
    console.log('server running on http:127.0.0.1:3000')
})
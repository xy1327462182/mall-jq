var USE_MOCK = true
if (USE_MOCK) {
    Mock.setup({
        timeout: 200
    })
	// Mock.mock('/carts/count', 'get', {
	// 	code: 0,
	// 	'data|1-20': 1,
	// })
    // Mock.mock('/carts', 'get', 
    // {
	// 	code: 0,
	// 	data: {
	// 		allChecked: '@boolean',
	// 		'totalPrice|1-9999': 1,
	// 		_id: "@string('lower', 24)",
	// 		'cartList|1-5': [
	// 			{
	// 				'count|1-10': 1,
	// 				'totalPrice|1-9999': 1,
	// 				checked: '@boolean',
	// 				_id: "@string('lower', 24)",
	// 				product: {
	// 					_id: "@string('lower',24)",
	// 					name: '@cword(3, 30)',
	// 					mainImage: "@dataImage('200x200')",
	// 					'price|1-9999': 1,
	// 					'stock|1-9999': 1,
	// 				},
	// 				attr: '颜色:白色;',
	// 			},
	// 		],
	// 	},
    // })
    // Mock.mock(/\/products\/search/, 'get', {
	// 	code: 0,
	// 	'data|0-8': [
    //         {
    //             _id: "@string('lower',24)",
	// 		    name: '@cword(3, 120)'
    //         }
    //     ]
    // })
    
    Mock.mock('/categories/arrayCategories', 'get', {
		code: 0,
		'data|10': [
            {
                "level": 1,
                _id: "@string('lower',24)",
			    name: '@cword(4)'
            }
        ],
    })
    Mock.mock(/\/categories\/childArrayCategories/, 'get', {
		code: 0,
		'data|1-15': [
            {
                "level": 2,
                _id: "@string('lower',24)",
                name: '@cword(2,4)',
                mainImage: "@dataImage('200x200')",
				'price|1-9999': 1,
            }
        ],
    })
    Mock.mock(/\/ads\/positionAds/, 'get', {
		code: 0,
		'data|3-7': [
            {
                "position": "1",
                "order": 0,
                "isShow": "1",
                "_id": "@string('lower',24)",
                "name": "@word(2,4)",
                "image": "@dataImage('862x440')",
                "link": "http://mall.kuazhu.com/detail.html?productId=5ea68e9e5dbe7a0023712b03"
            }
        ],
    })
    
    Mock.mock("/products/hot", 'get', {
		code: 0,
		'data|4': [
            {
                "order": 0,
                "isShow": "1",
                "isHot": "1",
                "payNums|0-1000": 0,
                "_id": "@string('lower',24)",
                "name": '@cword(3, 30)',
				"mainImage": "@dataImage('180x180')",
                'price|1-5999': 1,
            }
        ]
    })
    Mock.mock("/floors", 'get', {
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
                            "mainImage": "@dataImage('180x180')",
                            'price|1-5999': 1,
                            "stock|1-900": 1,
                        },
                ]
            }
        ]
    })
}

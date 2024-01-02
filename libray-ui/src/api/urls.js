const methodsTemplate = {
    "get": {
        method: "get"
    },
    "post": {
        method: "post"
    },
    "put": {
        method: "put"
    },
    "patch": {
        method: "patch"
    },
    "delete": {
        method: "delete"
    }
};
const urlsTemplate = {
    "auth": {
        "get":{
            "info": "auth/info"
        },
        "post": {
            "login": "auth/login",
            "changePassword": "auth/changePassword",
        }
    },
    "home": {
        "get":{
            "info": "home"
        }
    },
    "category":{
        "get":{
            "list":"category",
            "all": "category/all"
        },
        "post":{
            "add":"category"
        },
        "put":{
            "update":"category"
        },
        "delete":{
            "delete":"category"
        }
    },
    "book": {
        "get": {
            "list": "book",
        },
        "post": {
            "add": "book",
            "borrow": "book/borrow",
            "inStock" : "book/returned"
        },
        "put": {
            "update": "book"
        },
        "delete": {
            "delete": "book"
        }
    },
    "reader":{
        "get":{
            "list":"reader"
        },
        "post":{
            "add":"reader"
        },
        "put":{
            "update":"reader"
        },
        "delete":{
            "delete":"reader"
        }
    },
    "record": {
        "get": {
            "list": "record",
        }
    },
};

const urls = {};
Object.keys(urlsTemplate).forEach(function (group) {
    Object.keys(urlsTemplate[group]).forEach(function (methodName) {
        Object.keys(urlsTemplate[group][methodName]).forEach(function (name) {
            if (typeof urlsTemplate[group][methodName][name] === 'string') {
                urlsTemplate[group][methodName][name] = {
                    url: urlsTemplate[group][methodName][name]
                };
            }
            if (urls[group] === undefined) {
                urls[group] = {};
            }
            if (urls[group][methodName] === undefined) {
                urls[group][methodName] = {};
            }
            urls[group][methodName][name] = Object.assign({}, methodsTemplate[methodName], urlsTemplate[group][methodName][name]);
        });
    });
});
console.log(urls)
export default urls
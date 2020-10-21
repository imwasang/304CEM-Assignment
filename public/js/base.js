const userMixin = {
    data() {
        return {
            loginStatus: false,
            userInfo: {}
        }
    },
    methods: {
        validateLogin: function (cb) {
            var that = this
            $.ajax({
                url: '/api/user/validate',
                success: function (res) {
                    if (res.code == 0) {
                        if (location.href.indexOf('login') == -1) {
                            location.href = '/login.html?url=' + location.href
                        }
                    }

                    if (res.code == 0) {
                        that.loginStatus = false
                    } else {
                        that.userInfo = res
                        that.loginStatus = true
                    }
                    if (cb) {
                        cb()
                    }
                }
            })
        },
        logout: function () {
            $.ajax({
                url: '/api/user/logout',
                type: 'get',
                success: function () {
                    location.href = '/login.html?url=' + location.href
                }
            })
        }
    }
}

const toastMixin = {
    mounted: function () {
        $('.toast .close').click(function () {
            $('.toast').toast('hide')
        })
        $('.toast').on('shown.bs.toast', function () {
            $('.toast-wrap').css('zIndex', 2)
        })
        $('.toast').on('hidden.bs.toast', function () {
            $('.toast-wrap').css('zIndex', 0)
        })
    }
}

const navCategoriesMixin = {
    data() {
        return {
            recipeList: [],
            filterList: [],
            query: {}
        }
    },
    methods: {
        filterData: function () {
            var that = this
            this.filterList = this.recipeList.filter(function (item) {
                return item.RecipeCategory.toUpperCase() == that.query.category.toUpperCase()
            })
        }
    },
    mounted: function () {
        var that = this;
        var search = location.search;
        var query = {};
        if (search.indexOf("?") != -1) {
            var str = search.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                query[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        this.query = query


        that.validateLogin(function () {
            var url = '/api/recipe'
            if (location.pathname == '/faviourite.html') {
                url = '/api/love/' + that.userInfo.UserID
            }
            $.ajax({
                url: url,
                type: 'get',
                success: function (res) {
                    that.recipeList = res.list
                    that.filterList = res.list
                    if (that.query.category) {
                        that.filterData()
                    }
                }
            })
        })
    },
}


Vue.filter('formate', function (datetime) {
    const tmpDate = new Date();
    let year = tmpDate.getFullYear();
    let month = tmpDate.getMonth();
    let day = tmpDate.getDate();
    let hour = tmpDate.getHours();
    let minute = tmpDate.getMinutes();
    let second = tmpDate.getSeconds();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    second = second < 10 ? '0' + second : second;
    return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second
})

Vue.component('recipe-nav', {
    mixins: [userMixin],
    methods: {
        logoutEvent: function () {
            if (this.loginStatus == true) {
                this.logout()
            }
        },
        filterEvent: function (category) {
            location.href = '/?category=' + category
        }
    },
    mounted: function () {
        this.validateLogin()
    },
    template: `
        <nav class="navbar navbar-expand-sm">
            <div class="container">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a @click="filterEvent('Spaghetti')" class="nav-link" href="#">Spaghetti</a>
                    </li>
                    <li class="nav-item">
                        <a @click="filterEvent('Soup')" class="nav-link" href="#">Soup</a>
                    </li>
                    <li class="nav-item">
                        <a @click="filterEvent('Risotto')" class="nav-link" href="#">Risotto</a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="/"><h2><strong>Sunny Recipe Cooking</strong></h2></a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li v-if="$parent.userInfo ? $parent.userInfo.Admin : false" class="nav-item">
                        <a class="nav-link" href="/editRecipe.html">Add Recipe</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/faviourite.html">My Favourite</a>
                    </li>
                    <li class="nav-item">
                        <a @click="logoutEvent" class="nav-link" href="/login.html">{{this.loginStatus ? 'Logout':'Login'}}</a>
                    </li>
                </ul>
            </div>
        </nav>
    `
})
var Vue = require('vue');
//Vue.use(require('vue-resource'));

// new Vue({

//     ready: function() {
//     	el: '#myvueinstance'

//       // GET request
//       this.$http.get('http://localhost:8000/api/v1/banner/1/navigation', function (data, status, request) {

//           // set data on vm
//           this.$set('navigation', data)

//       }).error(function (data, status, request) {
//           // handle error
//       })

//     }

// })

var viewmodel = new Vue({
    el: '#myvueinstance',

	data: {
        libraries: ['angular.js', 'd3', 'node', 'jquery']
    },

    methods: {
        addLibrary: function () {
            this.libraries.push(this.newlibrary);

            this.newlibrary = '';
        },

        deleteLibraries: function () {
            this.libraries = [];
        }
    }
});
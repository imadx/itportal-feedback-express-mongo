var app;

document.addEventListener("DOMContentLoaded", function(event) {

app = new Vue({
    el: '#app',
    data: {
        students: []
    },
    methods: {
        getResults: function() {
            axios.get('/user?where={%22isStudent%22:%22true%22}&limit=100')
                .then(function(results) {
                    console.log(results);
                    app.students = _.concat(results.data)
                })
                .catch(function(err) {
                    console.log(err);
                })
        },
    },
    mounted: function() {
        this.getResults();
    }
});

});


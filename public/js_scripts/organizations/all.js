var app;

document.addEventListener("DOMContentLoaded", function(event) {

app = new Vue({
    el: '#app',
    data: {
        organizations: []
    },
    methods: {
        getResults: function() {
            axios.get('/organization?limit=100')
                .then(function(results) {
                    console.log(results);
                    app.organizations = _.concat(results.data)
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


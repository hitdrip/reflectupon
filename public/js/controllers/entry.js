window.rupon = window.rupon || {};
window.rupon.controllers = window.rupon.controllers || {};
window.rupon.utils = window.rupon.utils || {};

(function() {

    var rc = window.rupon.controllers,
        rv = window.rupon.views,
        rm = window.rupon.models,
        rh = window.rupon.helpers;

    rc.startEntryPage = function(thought, message, login) {

        $('.sign-up-btn').on('click', function() {
            new rv.ModalView({view: "signup"});
        })
        $('.log-in-btn').on('click', function() {
            new rv.ModalView({view: "login"});
        });

        var popular_collection = new rm.thoughtCollection(thought);

        var popularView = new rv.ThoughtsView({
            collection: popular_collection,
            reply_collection: rm.replyCollection,
            user: rupon.account_info
        });

        $(".popular-container").html(popularView.$el);
        popularView.trigger('content-loaded');

    }

})();

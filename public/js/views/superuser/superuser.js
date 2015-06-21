window.rupon = window.rupon || {};
window.rupon.views = window.rupon.views || {};

(function() {

    var rv = window.rupon.views,
        cv = window.rupon.common_views;

    rv.SuperUserView = cv.Container.extend({
        tagName: 'div',
        className: 'super-user',

        template: Handlebars.templates['super-user'],

        initialize: function(options) {
            cv.Container.prototype.initialize.call(this);

            this.render(options);
        },

        render: function(options) {

            this.$el.html(this.template());

            var nav_types = ['actives', 'featured', 'tags', 'users', 'vet'];

            var leftView = new rv.SuperUserLeftView({nav_types: nav_types});
            this.addChild(leftView, '.left-container');

            this.renderOnTrigger(leftView, nav_types, options);
            this.renderRightView(options,'actives');

        },

        renderOnTrigger: function(view, trigger_types, options) {
            var self = this;
            _.each(trigger_types, function(type) {
                view.on('click-'+ type, function() {
                    self.renderRightView(options, type);
                })
            })
        },

        renderRightView: function(options, type) {

            this.removeChild(this.superUserRight);

            var types = {
                'actives': ['ActiveUserRangesView', 'user_ranges_collection'],
                'tags':    ['TopicsView', 'topics_collection'],
                'users':   ['UsersView', 'user_collection'],
                'vet':     ['SuperUserThoughtsView', 'other_thoughts_collection'],
                'featured':['SuperUserThoughtsView', 'featured_collection']
            };

            this.superUserRight = new rv[types[type][0]]({
                collection: options[types[type][1]]
            });

            this.addChild(this.superUserRight, '.right-container');
        }

    });

    rv.SuperUserLeftView = cv.TemplateView.extend({
        template: Handlebars.templates['super-user-left'],

        events: {
            'click li': 'clickNav'
        },

        initialize: function(options) {
            this.render(options);
            this.navTypes = options.nav_types;
        },

        clickNav: function(e) {
            var navOption = $(e.currentTarget).attr('class');

            if (_.contains(this.navTypes, navOption)) {
                this.trigger('click-' + navOption);
            }
        }

    });

    rv.TopicsView = cv.CollectionContainer.extend({

        container_ele: 'ul',
        template: Handlebars.compile("<ul></ul><input type='text' /><a class='add' href='javascript:;'>Add topic</a>"),

        events: {
            'click .add': 'addTopic'
        },

        initialize: function() {
            cv.CollectionContainer.prototype.initialize.call(this, function(model) {
                return new rv.TopicView({model: model});
            });
        },

        addTopic: function() {

            var topic = this.$el.find('input').val();

            this.collection.create({
                name: topic
            });

            this.$el.find('input').val("");
        }

    });

    rv.TopicView = cv.SimpleModelView.extend({
        tagName: "li",
        template: Handlebars.compile("{{name}} <a class='remove' href='javascript:;'>Remove</a>"),

        events: {
            'click .remove': 'removeTopic'
        },

        removeTopic: function() {
            this.model.destroy();
        }
    });

    rv.EmailsView = cv.TemplateView.extend({

        template: Handlebars.compile("<a href='javascript:;'>send emails</a>"),

        events: {
            'click a': 'sendEmail'
        },

        sendEmail: function(){
            this.model.save();
        }
    });

    rv.ActiveUserRangesView = cv.CollectionContainer.extend({
        tagName: "div",
        className: "active-user-ranges-view",

        initialize: function() {
            cv.CollectionContainer.prototype.initialize.call(this, function(model) {
                return new rv.ActiveUserRangeView({model: model});
            });
        }

    });

    rv.ActiveUserRangeView = cv.TemplateView.extend({
        className: "active-user-range clearfix",
        template: Handlebars.templates['active-user-ranges'],

        render: function(options) {
            var template_options = _.clone(this.model.attributes);
            template_options.start_date = moment(template_options.start_date).format('MMM D');
            template_options.end_date = moment(template_options.end_date).format('MMM D');
            cv.TemplateView.prototype.render.call(this, template_options);
        }

    });

    rv.UsersView = cv.CollectionContainer.extend({
        tagName: 'ul',
        className: 'users-view',

        initialize: function() {
            cv.CollectionContainer.prototype.initialize.call(this, function(model) {
                return new rv.UserView({model: model})
            })
        }

    });

    rv.UserView = Backbone.View.extend({
        tagName: 'li',
        className: 'clearfix',
        template: Handlebars.templates['user'],

        events: {
            'click .delete a': 'deleteUser',
            'click .confirm': 'confirmDeleteUser'
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            var template_options = _.clone(this.model.attributes);
            var date = new Date(template_options.created_at);

            if (template_options.created_at) template_options.date = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
            this.$el.html(this.template(template_options));
        },

        deleteUser: function() {
            this.$el.append('<a href="javascript:;" class="confirm">Confirm Delete?</a>')
        },

        confirmDeleteUser: function() {
            this.model.destroy();
        }
    });

    rv.SuperUserThoughtsView = cv.CollectionContainer.extend({
        tagName: 'ul',
        className: 'vet-thought-view',

        initialize: function() {
            cv.CollectionContainer.prototype.initialize.call(this, function(model) {
                return new rv.SuperUserThoughtView({model: model})
            })
        }
    });

    rv.SuperUserThoughtView = cv.SimpleModelView.extend({
        tagName: 'li',
        template: Handlebars.templates['vet-thought'],

        events: {
            'click .delete': 'deleteThought',
            'click .set-private': 'setPrivate',
            'click .feature': 'setFeature'
        },

        deleteThought: function() {
            this.model.destroy();
        },

        setPrivate: function() {
            this.model.save({privacy: 'PRIVATE'});
        },

        setFeature: function() {
            this.model.save({feature: !this.model.get('feature')});
        }

    });
})();
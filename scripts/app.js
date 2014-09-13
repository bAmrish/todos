window.Todos = Ember.Application.create();

Todos.ApplicationAdapter = DS.FixtureAdapter;

Todos.Router.map(function(){
	this.resource('notebooks', function(){
		this.resource('notebook', {'path': ':notebook_id'}, function(){
			this.route('all');
			this.route('completed');
			this.route('active');
		});
	})
});

Todos.IndexRoute = Ember.Route.extend({
	redirect: function () {
        this.transitionTo('notebooks');
    }
});

Todos.NotebooksRoute = Ember.Route.extend({
	model: function(){
		return this.store.findAll('notebook');
	}
});

Todos.NotebookRoute = Ember.Route.extend({
	model: function(params){
		return this.store.find('notebook', params.notebook_id);
	}
});

Todos.NotebookIndexRoute = Ember.Route.extend({
	redirect: function(){
		this.transitionTo('notebook.all')
	}
});

Todos.NotebookAllController = Ember.ObjectController.extend({
	needs: ['notebook'],

	filteredTodos: Ember.computed.alias('controllers.notebook.todos')
});

Todos.NotebookCompletedController = Ember.ObjectController.extend({
	needs: ['notebook'],

	allTodos: Ember.computed.alias('controllers.notebook.todos'),

	filteredTodos: function(){
		return this.get('allTodos').filterBy('completed', true)
	}.property('allTodos', 'allTodos.@each', 'allTodos.@each.completed')

});

Todos.NotebookActiveController = Ember.ObjectController.extend({
	needs: ['notebook'],

	allTodos: Ember.computed.alias('controllers.notebook.todos'),

	filteredTodos: function(){
		return this.get('allTodos').filterBy('completed', false)
	}.property('allTodos', 'allTodos.@each', 'allTodos.@each.completed')

});

Todos.NotebooksController = Ember.ArrayController.extend({
	actions: {
		addNotebook: function(){
			var notebookName = Ember.$('#add-notebook').val();
			if(Ember.isEmpty(notebookName.trim())){
				return;
			}

			var newNotebook = this.store.createRecord('notebook', {
				name: notebookName
			});

			this.transitionToRoute('notebook', newNotebook);
			
			Ember.$('#add-notebook').val('');
		},

		deleteNotebook: function(notebook){
			this.store.deleteRecord(notebook);
			this.transitionToRoute('notebooks');
		}
	}
});

Todos.NotebookController = Ember.ObjectController.extend({
	completedTodos: function(){
		return this.get('todos').filterBy('completed', true).length;
	}.property('todos.@each', 'todos.@each.completed'),

	actions: {
		addTodo: function(){
			var todoText = Ember.$('.add-item-text').val();
			var newTodo;

			if(Ember.isEmpty(todoText.trim())) {
				return;
			}

			newTodo = this.store.createRecord('todo', {
				text: todoText,
				completed: false
			});

			this.get('todos').addObject(newTodo);

			Ember.$('.add-item-text').val("");
			Ember.$('.add-item-text').focus();
		},

		deleteTodo: function(item){
			this.store.deleteRecord(item);
		}
	}
});


Todos.Todo = DS.Model.extend({
	'text': DS.attr('string'),
	'completed': DS.attr('boolean'),
	'notebook': DS.belongsTo('notebook')
});

Todos.Notebook = DS.Model.extend({
	name: DS.attr('string'),
	todos: DS.hasMany('todo', {async: true})
});


Todos.Todo.FIXTURES = [
	{id: 1, text: 'Get Milk', completed: true, notebook: 1},
	{id: 2, text: 'Get Eggs', completed: false, notebook: 1},
	{id: 3, text: 'Work on project 1', completed: false, notebook: 2},
	{id: 4, text: 'Send email to someone', completed: false, notebook: 2},
];

Todos.Notebook.FIXTURES = [
	{id: 1, name: 'Personal', todos: [1, 2]},
	{id: 2, name: 'Work', todos: [3, 4]}
]

Todos.TodoItemComponent = Ember.Component.extend({
	_inEditMode: false,

	text: Ember.computed.alias('todo.text'),

	actions: {
		toggleComplete: function(item) {
			item.toggleProperty('completed');
		},

		edit: function(item){
			this.toggleProperty('_inEditMode');
		},

		editComplete: function () {
			this.toggleProperty('_inEditMode');
		},

		deleteItem: function(item) {
			this.sendAction('deleteItem', item);
		}
	}
});

Todos.NotebookItemComponent = Ember.Component.extend({
	actions: {
		_inEditMode: false,

		deleteItem: function(item){
			this.sendAction('deleteItem', item);
		},

		edit: function(){
			this.toggleProperty('_inEditMode')
		},

		editComplete: function(){
			this.toggleProperty('_inEditMode')
		}
	}
});

Ember.TextField.reopen({
  didInsertElement: function(){
    if(this.get('autofocus')){
      this.$().focus();      
      var element = this.$()[0]; 

        if (element.setSelectionRange){
		  	// If this function exists then use it
	        // (Doesn't work in IE)

        	// Double the length because Opera is inconsistent 
        	// about whether a carriage return is one character or two. Sigh.
	        var len = this.$().val().length * 2;
	    	element.setSelectionRange(len, len);
        } else {
	        // ... otherwise replace the contents with itself
	        // (Doesn't work in Google Chrome)
	        this.$().val(this.$().val());
        }
    }
  }
});
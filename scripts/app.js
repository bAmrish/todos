window.Todos = Ember.Application.create();

Todos.ApplicationAdapter = DS.FixtureAdapter;

Todos.Router.map(function(){
	this.resource('todos');
});


Todos.IndexRoute = Ember.Route.extend({
	redirect: function () {
        this.transitionTo('todos');
    }
});

Todos.TodosRoute = Ember.Route.extend({
	model: function(){
		return this.store.findAll('todo');
	}
});

Todos.TodosController = Ember.ArrayController.extend({
	completedTodos: function(){
		return this.filterBy('completed', true).length;
	}.property('@each', '@each.completed'),

	actions: {
		addTodo: function(){
			var todoText = Ember.$('.add-item-text').val();
			
			if(Ember.isEmpty(todoText.trim())) {
				return;
			}

			this.store.createRecord('todo', {
				text: todoText,
				completed: false
			});

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
	'completed': DS.attr('boolean')
});

Todos.Todo.FIXTURES = [
	{id: 1, text: 'First Todo', completed: true},
	{id: 2, text: 'Second Todo', completed: false}
];

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

		delete: function(item) {
			this.sendAction('delete', item);
		}
	}
});

Todos.TodoItemEditComponent = Ember.TextField.extend({
	classNames: ['todo-item-edit'],
	
	actions: {
		focusOut: function(){
			this.sendAction('done');
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
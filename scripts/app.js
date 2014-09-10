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
	actions: {
		toggleComplete: function(item) {
			item.toggleProperty('completed');
		},

		delete: function(item) {
			this.sendAction('delete', item);
		}
	}
});
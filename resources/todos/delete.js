cancelUnless(me, "You must be logged in to delete a todo", 401);

this.lastModification = new Date().getTime();
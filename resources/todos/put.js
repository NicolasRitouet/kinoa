cancelUnless(me, "You must be logged in to modify a todo", 401);

this.lastModification = new Date().getTime();
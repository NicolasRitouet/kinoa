cancelUnless(me, "You must be logged in to modify a contact", 401);

this.lastModification = new Date().getTime();
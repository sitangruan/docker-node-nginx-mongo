// Will run at container init under /docker-entrypoint-initdb.d/
const dbname = 'todo';
db = db.getSiblingDB(dbname);
db.createCollection('tasks');
db.tasks.insertMany([
  { task: 'Buy groceries', completed: false, createdAt: new Date() },
  { task: 'Walk the dog', completed: true, createdAt: new Date() },
  { task: 'Read a book', completed: false, createdAt: new Date() }
]);
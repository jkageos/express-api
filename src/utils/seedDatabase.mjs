import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { User } from '../mongoose/schemas/user.mjs';
import { Blog } from '../mongoose/schemas/blog.mjs';
import { Tag } from '../mongoose/schemas/tag.mjs';
import { Comment } from '../mongoose/schemas/comment.mjs';
import { hashPassword } from './helpers.mjs';

mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.MONGO_DB_NAME}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Tag.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashPassword('password123'),
        isAdmin: faker.datatype.boolean(),
      });
      users.push(await user.save());
    }

    // Create tags
    const tags = [];
    for (let i = 0; i < 5; i++) {
      const tag = new Tag({
        name: faker.word.noun(),
      });
      tags.push(await tag.save());
    }

    // Create blogs
    const blogs = [];
    for (let i = 0; i < 20; i++) {
      const blog = new Blog({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        author: users[Math.floor(Math.random() * users.length)]._id,
        estimatedReadTime: faker.datatype.number({ min: 1, max: 30 }),
        picture: faker.image.url(),
        video: faker.internet.url(),
        upvotes: faker.datatype.number({ min: 0, max: 100 }),
        tags: faker.helpers.arrayElements(tags, faker.datatype.number({ min: 1, max: 3 })).map(tag => tag._id),
      });
      blogs.push(await blog.save());
    }

    // Create comments
    for (let i = 0; i < 50; i++) {
      const comment = new Comment({
        content: faker.lorem.paragraph(),
        author: users[Math.floor(Math.random() * users.length)]._id,
        blog: blogs[Math.floor(Math.random() * blogs.length)]._id,
        parentComment: i > 10 ? faker.helpers.arrayElement([null, ...Array(i).keys()]) : null,
      });
      await comment.save();
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

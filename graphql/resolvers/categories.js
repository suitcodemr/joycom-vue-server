const Category = require('../../models/Category');

module.exports = {
	Query: {
		async getCategory(_, { category }) {
			console.log('getCategory');
			const categoryName = category;
			try {
				const category = await Category.findOne({ name: categoryName });
				console.log(category);
				return category;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getCategories() {
			console.log('getCategories');
			try {
				const categories = await Category.find();
				console.log(categories);
				return categories.reverse().map((category) => {
					return category;
				});
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async createCategory(_, { name }) {
			//dont check if a category exist, because only developer
			console.log('createCategory');
			const newCategory = new Category({
				name,
			});
			const category = await newCategory.save();
			return category;
		},
	},
};

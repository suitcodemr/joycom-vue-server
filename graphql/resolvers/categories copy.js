const Category = require('../../models/Category');

module.exports = {
	Query: {
		async getCategories() {
			try {
				const categories = await Category.find();
				return categories.map(category => {
					return category;
				});
			} catch (err) {
				throw new Error(err);
			}
		}
	}
};




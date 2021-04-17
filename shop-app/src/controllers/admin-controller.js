const fileHelper = require('../utils/file');

const { validationResult } = require('express-validator');

const Product = require('../models/product');

class AdminController {
  static getAddProduct(req, res, next) {
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  }

  static postAddProduct(req, res, next) {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        product: {
          title: title,
          price: price,
          description: description,
        },
        errorMessage: 'Attached file is not an image.',
        validationErrors: [],
      });
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        product: {
          title: title,
          price: price,
          description: description,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const imageUrl = image.path;

    const product = new Product({
      // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user,
    });
    return product
      .save()
      .then((result) => {
        // console.log(result);
        console.log('Created Product');
        return res.redirect('/admin/products');
      })
      .catch((err) => {
        // return res.status(500).render('admin/edit-product', {
        //   pageTitle: 'Add Product',
        //   path: '/admin/add-product',
        //   editing: false,
        //   hasError: true,
        //   product: {
        //     title: title,
        //     imageUrl: imageUrl,
        //     price: price,
        //     description: description
        //   },
        //   errorMessage: 'Database operation failed, please try again.',
        //   validationErrors: []
        // });
        // res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }

  static getEditProduct(req, res, next) {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    return Product.findById(prodId)
      .then((product) => {
        if (!product) {
          return res.redirect('/');
        }
        return res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          hasError: false,
          errorMessage: null,
          validationErrors: [],
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }

  static postEditProduct(req, res, next) {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDesc,
          _id: prodId,
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    return Product.findById(prodId)
      .then((product) => {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if (image) {
          fileHelper.deleteFile(product.imageUrl);
          product.imageUrl = image.path;
        }
        return product.save().then((result) => {
          console.log('UPDATED PRODUCT!');
          return res.redirect('/admin/products');
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }

  static getProducts(req, res, next) {
    return (
      Product.find({ userId: req.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then((products) => {
          console.log(products);
          return res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        })
    );
  }

  static deleteProduct(req, res, next) {
    const prodId = req.params.productId;
    return Product.findById(prodId)
      .then((product) => {
        if (!product) {
          return next(new Error('Product not found.'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: prodId, userId: req.user._id });
      })
      .then(() => {
        console.log('DESTROYED PRODUCT');
        return res.status(200).json({ message: 'Success!' });
      })
      .catch((err) => {
        return res.status(500).json({ message: 'Deleting product failed.' });
      });
  }
}

module.exports = AdminController;

const router = require('express').Router();
const {
    getAllPizzas,
    getPizzaById,
    createPizza, 
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

// set up GET all and POST at /api/pizzas
router
.route('/')
.get(getAllPizzas)
.post(createPizza);

// set up GET one, PUT, and DELETE at /api/pizzas/:id
router
.route('/:id')
.get(getPizzaById)
.put(updatePizza)
.delete(deletePizza);

module.exports = router;
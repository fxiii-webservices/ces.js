var Class = require('./class');

/**
 * The system is responsible for updating the entities.
 * @class
 */
var System = module.exports = Class.extend({
    /**
     * @constructor
     */
    init: function () {
        /**
         * This property will be set when the system is added to a world.
         * @public
         */
        this.world = null;
    },
    
    /**
     * Components needs.
     * Declare an array of components to receive the "this.entity" bonus!! 
     * Declare components + setupEvent method to get notified about interesting Entities
     * Declare components + tearDown method to get notified about Entities that cease to be interesting
     * @public
     components: [], 

    /**
     * Update the entities.
     * @public
     * @param {Number} dt time interval between updates
     */
    update: function (dt) {
        throw new Error('Subclassed should override this method');
    }
});

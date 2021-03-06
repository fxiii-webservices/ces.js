/*globals describe: true, it: true */

var CES = require('../'),
    CompA = CES.Component.extend({ name: 'a' }),
    CompB = CES.Component.extend({ name: 'b' }),
    CompC = CES.Component.extend({ name: 'c' });

function createEntityA() {
    var entity = new CES.Entity();
    entity.addComponent(new CompA());
    entity.addComponent(new CompB());
    entity.addComponent(new CompC());
    return entity;
}

function createEntityB() {
    var entity = new CES.Entity();
    entity.addComponent(new CompA());
    entity.addComponent(new CompB());
    return entity;
}

function createEntityC() {
    var entity = new CES.Entity();
    entity.addComponent(new CompA());
    entity.addComponent(new CompC());
    return entity;
}

describe('world', function () {
    it('should get correct entities for each family', function () {
        var world = new CES.World(),
            e, i;

        for (i = 0; i < 100; ++i) {
            e = createEntityA();
            world.addEntity(e);
        }
        for (i = 0; i < 100; ++i) {
            e = createEntityB();
            world.addEntity(e);
        }
        for (i = 0; i < 100; ++i) {
            e = createEntityC();
            world.addEntity(e);
        }

        world.getEntities('a').length.should.equal(300);
        world.getEntities('b').length.should.equal(200);
        world.getEntities('c').length.should.equal(200);
        world.getEntities('a', 'b', 'c').length.should.equal(100);
        world.getEntities('a', 'b').length.should.equal(200);
        world.getEntities('a', 'c').length.should.equal(200);
        world.getEntities('a', 'b', 'c', 'd').length.should.equal(0);
    });

    it('should update entity-family relationship when adding components', function () {
        var world = new CES.World(),
            e, i;

        for (i = 0; i < 100; ++i) {
            e = createEntityB();
            world.addEntity(e);
        }
        world.getEntities('a', 'b').length.should.equal(100);
        world.getEntities('a', 'b', 'c').length.should.equal(0);

        e.addComponent(new CompC());
        world.getEntities('a', 'b', 'c').length.should.equal(1);
    });

    it('should update entity-family relationship when removing components', function () {
        var world = new CES.World(),
            e, i;

        for (i = 0; i < 100; ++i) {
            e = createEntityA();
            world.addEntity(e);
        }
        world.getEntities('a', 'b', 'c').length.should.equal(100);
        world.getEntities('a', 'b').length.should.equal(100);

        e.removeComponent('c');

        world.getEntities('a', 'b', 'c').length.should.equal(99);
        world.getEntities('a', 'b').length.should.equal(100);
    });
    
    it('should set this.entities when updating a system with valid components',function(){
        var world = new CES.World(),
            a,b,c,verboseSystem,
            VerboseSystem = CES.System.extend({
                components: ['a', 'b'],
                update: function (dt) {
                    var entities = this.entities;
                    entities.should.include(a);
                    entities.should.include(b);
                    entities.should.not.include(c);
                }
            });
        a = createEntityA(); // a, b, c
        b = createEntityB(); // a, b,
        c = createEntityC(); // a, c
        verboseSystem = new VerboseSystem();
        world.addEntity(a);
        world.addEntity(b);
        world.addEntity(c);
        world.addSystem(verboseSystem);
        world.update(1);
        
    });
    
    it('should notify the new systems about exising and interesting Entities' ,function(){
        var world = new CES.World(),
            a,b,c,verboseSystem,
            entitiesSaw = [],
            VerboseSystem = CES.System.extend({
                components: ['a', 'b'],
                setupEntity: function(entity){
                    entitiesSaw.push(entity);
                }
            });
            
        a = createEntityA(); // a, b, c
        b = createEntityB(); // a, b,
        c = createEntityC(); // a, c
        verboseSystem = new VerboseSystem();
        world.addEntity(a);
        world.addEntity(b);
        world.addEntity(c);
        world.addSystem(verboseSystem);
        
        entitiesSaw.should.include(a);
        entitiesSaw.should.include(b);
        entitiesSaw.should.not.include(c);
    });
    
    it('should notify the systems about freshly added interesting Entities' ,function(){
        var world = new CES.World(),
            a,b,c,verboseSystem,
            entitiesSaw = [],
            VerboseSystem = CES.System.extend({
                components: ['a', 'b'],
                setupEntity: function(entity){
                    entitiesSaw.push(entity);
                }
            });
            
        a = createEntityA(); // a, b, c
        b = createEntityB(); // a, b,
        c = createEntityC(); // a, c
        verboseSystem = new VerboseSystem();
        world.addSystem(verboseSystem);
        
        world.addEntity(a);
        world.addEntity(b);
        world.addEntity(c);
        
        entitiesSaw.should.include(a);
        entitiesSaw.should.include(b);
        entitiesSaw.should.not.include(c);
    });
    
    it('should notify the systems about Entities becoming interisting' ,function(){
        var world = new CES.World(),
            a,b,c,verboseSystem,
            entitiesSaw = [],
            VerboseSystem = CES.System.extend({
                components: ['a', 'b'],
                setupEntity: function(entity){
                    entitiesSaw.push(entity);
                }
            });
            
        a = createEntityA(); // a, b, c
        b = createEntityB(); // a, b,
        c = createEntityC(); // a, c
        verboseSystem = new VerboseSystem();
        world.addSystem(verboseSystem);
        
        world.addEntity(a);
        world.addEntity(b);
        world.addEntity(c);
        // c is interesting now!
        c.addComponent(new CompB());
        
        entitiesSaw.should.include(a);
        entitiesSaw.should.include(b);
        entitiesSaw.should.include(c);
    });
    
    it('should notify the systems about Entities ceasing to be interesting' ,function(){
        var world = new CES.World(),
            a,b,c,verboseSystem,
            entitiesSaw = [],
            VerboseSystem = CES.System.extend({
                components: ['a', 'b'],
                teardownEntity: function(entity){
                    entitiesSaw.push(entity);
                }
            });
            
        a = createEntityA(); // a, b, c
        b = createEntityB(); // a, b,
        c = createEntityC(); // a, c
        verboseSystem = new VerboseSystem();
        world.addSystem(verboseSystem);
        
        world.addEntity(a);
        world.addEntity(b);
        world.addEntity(c);
        
        // a is not interesting anymore!
        a.removeComponent("b");
        // b is not in this world enymore..
        world.removeEntity(b);
        
        entitiesSaw.should.include(a);
        entitiesSaw.should.include(b);
        entitiesSaw.should.not.include(c);
    });
});

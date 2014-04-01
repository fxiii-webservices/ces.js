/*globals describe: true, it: true */

var CES = require('../'),
    Family = require('../src/family'),
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

describe('family', function () {
    it('should notify when new entity is added', function (done) {
        var 
            surname = ['a','b','c'],
            family = new Family(surname),
            entity = createEntityA();
        family.onEntityAdded.add(function(newEntity,familyName){
            newEntity.should.equal(entity);
            familyName.should.equal(surname);
            family._entities.length.should.equal(1);
            done();
        });
        family.addEntityIfMatch(entity);
    });
    it('should not notify when the same entity is added', function (done) {
        var 
            surname = ['a','b','c'],
            family = new Family(surname),
            entity = createEntityA();
        family.addEntityIfMatch(entity);
        family.onEntityAdded.add(function(newEntity,familyName){
            throw("wrong notification");
        });
        family.addEntityIfMatch(entity);
        // should notify within 30 or it "should" false positive....
        setTimeout(done,30);
    });
    it('should notify when entity is removed', function (done) {
        var 
            surname = ['a','b','c'],
            family = new Family(surname),
            entity = createEntityA();
        function checkRemoving(oldEntity,familyName){
            oldEntity.should.equal(entity);
            familyName.should.equal(surname);
            family._entities.length.should.equal(0);
            done();
        }
        family.addEntityIfMatch(entity);
        family.onEntityRemoved.add(checkRemoving);
        family.removeEntity(entity);
    });
    it('should not notify when an entity can not be removed', function (done) {
        var 
            surname = ['a','b','c'],
            family = new Family(surname),
            entity = createEntityA();
        //family.addEntityIfMatch(entity);
        family.onEntityRemoved.add(function(entity,familyName){
            throw ("entity does not exist in collection, its deletion should not be notified");
        });
        family.removeEntity(entity);
        setTimeout(done,30);
    });
});

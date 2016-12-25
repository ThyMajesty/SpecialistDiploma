from .models import *

def run():
    db = KnowlageDB(value={"name":"Insects"}).save()
    ant = Instance(value={"name":"Ant"}).save()
    spider = Instance(value={"name":"Spider"}).save()
    dragonfly = Instance(value={"name":"Dragonfly"}).save()
    rel = db.instances.connect(ant)
    rel = db.instances.connect(spider)
    rel = db.instances.connect(dragonfly)
    db.save()

    def from_to(con_name, from_inst, to_inst):
        connection = Connection(value={"name":con_name}).save()
        connection.rel_from.connect(from_inst)
        i = Instance(value={"name":to_inst}).save()
        connection.rel_to.connect(i)
        connection.save()

    from_to("Synonyms", ant, "emmet")
    from_to("Synonyms", ant, "pismire")

    from_to("Usages", spider, "He is webbed by Spider Man in the end.")
    from_to("Usages", spider, "He found a spider web in his room.")


    from_to("Noun", dragonfly, "slender-bodied non-stinging insect having iridescent wings that are outspread at rest")
    from_to("Noun", dragonfly, " adults and nymphs feed on mosquitoes etc.")
from py2neo import Graph

graph = Graph("https://neo4j:qwerty@192.168.99.100:32769/db/data/")

graph.cypher.execute("CREATE (c:Person {name:{N}}) RETURN c", {"N": "Carol"})
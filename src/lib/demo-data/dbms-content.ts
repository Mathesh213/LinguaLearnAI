import type { DocumentSection } from '@/types';

// ── Raw DBMS Educational Text ─────────────────────────────────
export const DBMS_RAW_TEXT = `
Database Management Systems — A Comprehensive Study Guide

Chapter 1: Database Fundamentals

A database is an organized collection of structured data stored electronically in a computer system. A Database Management System (DBMS) is software that manages databases and provides an interface for users to store, retrieve, update, and delete data efficiently.

Databases are essential in modern computing because they allow multiple users to access and manipulate data simultaneously while ensuring data consistency, security, and integrity. Without a DBMS, every application would need to manage its own data storage, leading to inconsistency and duplication.

Key characteristics of a DBMS include:
- Data Independence: The separation between data and application programs
- Data Integrity: Ensuring data remains accurate and consistent
- Data Security: Controlling who can access and modify data
- Concurrent Access: Allowing multiple users to work simultaneously
- Backup and Recovery: Protecting data from system failures

Types of Databases:
1. Relational Databases: Store data in tables with rows and columns (e.g., MySQL, PostgreSQL, Oracle)
2. NoSQL Databases: Use non-tabular storage for unstructured data (e.g., MongoDB, Cassandra)
3. Object-Oriented Databases: Store data as objects
4. Hierarchical Databases: Organize data in a tree structure
5. Network Databases: Use graph structures to represent data relationships

The three-level architecture of a DBMS (ANSI/SPARC) consists of:
- External Level: User views of the database
- Conceptual Level: Logical structure of the entire database
- Internal Level: Physical storage of data on disk

Chapter 2: The Relational Model

The relational model, proposed by E.F. Codd in 1970, represents data as a collection of relations (tables). It provides a mathematical foundation for organizing and querying data.

A relation is a two-dimensional table with:
- Rows (Tuples): Each row represents a single entity instance
- Columns (Attributes): Each column represents a property of the entity
- Domain: The set of allowed values for an attribute

Formal Definitions:
- Relation Schema: R(A1, A2, ..., An) where R is the relation name and A1...An are attributes
- Relation Instance: A set of tuples conforming to the schema
- Degree: The number of attributes in a relation
- Cardinality: The number of tuples in a relation

Relational Algebra Operations:
1. Selection (σ): Selects rows satisfying a condition — σ_condition(R)
2. Projection (π): Selects specific columns — π_attributes(R)
3. Union (∪): Combines tuples from two compatible relations
4. Set Difference (−): Returns tuples in R1 but not R2
5. Cartesian Product (×): Combines every tuple of R1 with every tuple of R2
6. Join (⋈): Combines related tuples from two relations

Properties of Relations:
- No duplicate tuples (each row is unique)
- Tuples have no defined order
- Attribute values are atomic (single-valued, indivisible)
- Each attribute has a unique name within the relation

Chapter 3: Database Keys

Keys are fundamental constraints in relational databases that ensure data integrity and establish relationships between tables.

Super Key: Any set of attributes that uniquely identifies a tuple in a relation. A relation can have many super keys.

Candidate Key: A minimal super key — a set of attributes that uniquely identifies a tuple, with no subset that could also serve as a unique identifier. A relation may have multiple candidate keys.

Primary Key: One candidate key selected to be the main identifier for a relation. Properties:
- Must be unique across all tuples
- Cannot be NULL (entity integrity rule)
- Should be minimal and stable

Foreign Key: An attribute (or set of attributes) in one relation that references the primary key of another relation. This establishes referential integrity between tables.

Referential Integrity: Every foreign key value must either be NULL or match an existing primary key value in the referenced relation.

Example:
Student(StudentID, Name, Email, DeptID)
Department(DeptID, DeptName, Location)

Here, StudentID is the primary key of Student.
DeptID in Student is a foreign key referencing Department(DeptID).

Alternate Key: Candidate keys that were not selected as the primary key.

Composite Key: A key composed of two or more attributes that together uniquely identify a tuple.

Chapter 4: Functional Dependencies

A functional dependency (FD) is a constraint between two sets of attributes in a relation. If X → Y, then the value of X uniquely determines the value of Y.

Notation: X → Y means "X functionally determines Y" or "Y is functionally dependent on X."

Types of Functional Dependencies:
1. Full Functional Dependency: Y is fully functionally dependent on X if X → Y and no proper subset of X determines Y.
2. Partial Dependency: Y depends on a proper subset of X (a problem in 2NF).
3. Transitive Dependency: If X → Y and Y → Z, then X → Z transitively (a problem in 3NF).

Armstrong's Axioms (inference rules for FDs):
- Reflexivity: If Y ⊆ X, then X → Y
- Augmentation: If X → Y, then XZ → YZ  
- Transitivity: If X → Y and Y → Z, then X → Z

Derived rules:
- Union: If X → Y and X → Z, then X → YZ
- Decomposition: If X → YZ, then X → Y and X → Z
- Pseudotransitivity: If X → Y and WY → Z, then WX → Z

Closure of Attributes: The closure of X (written X+) is the set of all attributes functionally determined by X. Used to find candidate keys.

Minimal Cover (Canonical Cover): A minimal set of FDs that is equivalent to the original set. Each FD in the minimal cover has a single attribute on the right side, no redundant attributes on the left, and no redundant FDs.

Chapter 5: Normalization

Normalization is the process of organizing data in a relational database to reduce redundancy and improve data integrity. It involves decomposing tables into smaller, well-structured tables while preserving data and functional dependencies.

Anomalies in Unnormalized Tables:
1. Insertion Anomaly: Cannot insert new data without also inserting related data
2. Deletion Anomaly: Deleting one record unintentionally deletes other related data
3. Update Anomaly: Updating redundant data in multiple places risks inconsistency

First Normal Form (1NF):
A relation is in 1NF if:
- All attributes contain atomic (indivisible) values
- No repeating groups or arrays
- Each row is unique (has a primary key)

Example violation: Storing multiple phone numbers as "111, 222, 333" in a single column violates 1NF.

Second Normal Form (2NF):
A relation is in 2NF if:
- It is in 1NF
- Every non-key attribute is fully functionally dependent on the entire primary key (no partial dependencies)
- Partial dependency only possible when primary key is composite

Example: If R(A, B, C, D) has primary key {A, B} and C → D (partial dependency on A), then R violates 2NF.
Solution: Decompose into R1(A, B, C) and R2(C, D).

Third Normal Form (3NF):
A relation is in 3NF if:
- It is in 2NF
- No transitive dependencies exist (no non-key attribute determines another non-key attribute)
- For every FD X → Y, either X is a super key OR Y is a prime attribute (part of a candidate key)

Example: If Student(ID, Name, DeptID, DeptName) and DeptID → DeptName (transitive dependency), it violates 3NF.
Solution: Decompose into Student(ID, Name, DeptID) and Department(DeptID, DeptName).

Boyce-Codd Normal Form (BCNF):
A relation is in BCNF if:
- It is in 3NF
- For every non-trivial FD X → Y, X must be a super key
- BCNF is stricter than 3NF — it removes all anomalies related to FDs
- BCNF decomposition may not always preserve all FDs

4NF and 5NF address multivalued dependencies and join dependencies (advanced topics).

Chapter 6: Transactions and ACID Properties

A transaction is a logical unit of work that accesses and possibly modifies the contents of a database. Transactions must maintain database consistency.

ACID Properties:

Atomicity: A transaction is treated as a single, indivisible unit. Either all operations in the transaction succeed (commit) or none of them do (rollback). If any operation fails, the entire transaction is undone.

Consistency: A transaction brings the database from one valid state to another. All integrity constraints, rules, and business logic must be satisfied before and after the transaction.

Isolation: Concurrent transactions execute as if they were serial (one after another). The intermediate state of a transaction is not visible to other concurrent transactions. Isolation levels (SQL standard):
- READ UNCOMMITTED: Allows dirty reads
- READ COMMITTED: Prevents dirty reads
- REPEATABLE READ: Prevents dirty reads and non-repeatable reads  
- SERIALIZABLE: Full isolation, highest consistency

Durability: Once a transaction is committed, it remains committed even in the case of system failure. Changes are permanently recorded in non-volatile storage.

Transaction States:
1. Active: Transaction is executing
2. Partially Committed: Final operation has been executed
3. Committed: Transaction completed successfully
4. Failed: Error has occurred
5. Aborted: Transaction has been rolled back

Concurrency Problems:
- Dirty Read: Reading uncommitted data from another transaction
- Non-repeatable Read: Reading same data twice gives different values
- Phantom Read: New rows appear in the result set of a repeated query
- Lost Update: Two transactions read the same value and update it, one update is lost

Locking Mechanisms:
- Shared Lock (S-lock): Multiple transactions can read; prevents writes
- Exclusive Lock (X-lock): Only one transaction can read and write
- Two-Phase Locking (2PL): Growing phase (acquire locks), Shrinking phase (release locks)
- Deadlock: Two transactions each wait for the other's lock — detected using wait-for graphs
`.trim();

// ── Structured Sections ───────────────────────────────────────
export const DBMS_SECTIONS: DocumentSection[] = [
  {
    id: 'dbms-sec-0',
    title: 'Database Fundamentals',
    content: `A database is an organized collection of structured data stored electronically in a computer system. A Database Management System (DBMS) is software that manages databases and provides an interface for users to store, retrieve, update, and delete data efficiently.

Databases are essential in modern computing because they allow multiple users to access and manipulate data simultaneously while ensuring data consistency, security, and integrity. Without a DBMS, every application would need to manage its own data storage, leading to inconsistency and duplication.

Key characteristics of a DBMS include:
- Data Independence: The separation between data and application programs
- Data Integrity: Ensuring data remains accurate and consistent
- Data Security: Controlling who can access and modify data
- Concurrent Access: Allowing multiple users to work simultaneously
- Backup and Recovery: Protecting data from system failures

Types of Databases:
1. Relational Databases: Store data in tables with rows and columns (e.g., MySQL, PostgreSQL, Oracle)
2. NoSQL Databases: Use non-tabular storage for unstructured data (e.g., MongoDB, Cassandra)
3. Object-Oriented Databases: Store data as objects
4. Hierarchical Databases: Organize data in a tree structure

The three-level architecture of a DBMS (ANSI/SPARC) consists of:
- External Level: User views of the database
- Conceptual Level: Logical structure of the entire database
- Internal Level: Physical storage of data on disk`,
    order: 0,
    pageNumber: 1,
  },
  {
    id: 'dbms-sec-1',
    title: 'The Relational Model',
    content: `The relational model, proposed by E.F. Codd in 1970, represents data as a collection of relations (tables). It provides a mathematical foundation for organizing and querying data.

A relation is a two-dimensional table with:
- Rows (Tuples): Each row represents a single entity instance
- Columns (Attributes): Each column represents a property of the entity
- Domain: The set of allowed values for an attribute

Formal Definitions:
- Relation Schema: R(A1, A2, ..., An) where R is the relation name and A1...An are attributes
- Relation Instance: A set of tuples conforming to the schema
- Degree: The number of attributes in a relation
- Cardinality: The number of tuples in a relation

Relational Algebra Operations:
1. Selection (σ): Selects rows satisfying a condition — σ_condition(R)
2. Projection (π): Selects specific columns — π_attributes(R)
3. Union (∪): Combines tuples from two compatible relations
4. Cartesian Product (×): Combines every tuple of R1 with every tuple of R2
5. Join (⋈): Combines related tuples from two relations

Properties of Relations:
- No duplicate tuples (each row is unique)
- Tuples have no defined order
- Attribute values are atomic (single-valued, indivisible)`,
    order: 1,
    pageNumber: 5,
  },
  {
    id: 'dbms-sec-2',
    title: 'Database Keys',
    content: `Keys are fundamental constraints in relational databases that ensure data integrity and establish relationships between tables.

Super Key: Any set of attributes that uniquely identifies a tuple in a relation.

Candidate Key: A minimal super key — a set of attributes that uniquely identifies a tuple, with no subset that could also serve as a unique identifier.

Primary Key: One candidate key selected to be the main identifier. Properties:
- Must be unique across all tuples
- Cannot be NULL (entity integrity rule)
- Should be minimal and stable

Foreign Key: An attribute in one relation that references the primary key of another relation. This establishes referential integrity between tables.

Referential Integrity: Every foreign key value must either be NULL or match an existing primary key value in the referenced relation.

Example:
Student(StudentID, Name, Email, DeptID)
Department(DeptID, DeptName, Location)

StudentID is the primary key of Student.
DeptID in Student is a foreign key referencing Department(DeptID).

Alternate Key: Candidate keys not selected as the primary key.
Composite Key: A key composed of two or more attributes that together uniquely identify a tuple.`,
    order: 2,
    pageNumber: 9,
  },
  {
    id: 'dbms-sec-3',
    title: 'Functional Dependencies',
    content: `A functional dependency (FD) is a constraint between two sets of attributes. If X → Y, then the value of X uniquely determines the value of Y.

Types of Functional Dependencies:
1. Full Functional Dependency: Y is fully functionally dependent on X if X → Y and no proper subset of X determines Y.
2. Partial Dependency: Y depends on a proper subset of X (a problem in 2NF).
3. Transitive Dependency: If X → Y and Y → Z, then X → Z transitively (a problem in 3NF).

Armstrong's Axioms:
- Reflexivity: If Y ⊆ X, then X → Y
- Augmentation: If X → Y, then XZ → YZ  
- Transitivity: If X → Y and Y → Z, then X → Z

Derived rules:
- Union: If X → Y and X → Z, then X → YZ
- Decomposition: If X → YZ, then X → Y and X → Z

Closure of Attributes: The closure of X (written X+) is the set of all attributes functionally determined by X. Used to find candidate keys.

Minimal Cover: A minimal set of FDs equivalent to the original. Each FD has a single attribute on the right side, no redundant attributes on the left, and no redundant FDs.`,
    order: 3,
    pageNumber: 13,
  },
  {
    id: 'dbms-sec-4',
    title: 'Normalization',
    content: `Normalization is the process of organizing data in a relational database to reduce redundancy and improve data integrity. It involves decomposing tables into smaller, well-structured tables.

Anomalies in Unnormalized Tables:
1. Insertion Anomaly: Cannot insert new data without inserting unrelated data
2. Deletion Anomaly: Deleting one record unintentionally deletes related data
3. Update Anomaly: Updating redundant data in multiple places risks inconsistency

First Normal Form (1NF): All attributes contain atomic values; no repeating groups.

Second Normal Form (2NF): In 1NF + every non-key attribute is fully functionally dependent on the entire primary key (no partial dependencies).

Third Normal Form (3NF): In 2NF + no transitive dependencies. For every FD X → Y, either X is a super key OR Y is a prime attribute.

Boyce-Codd Normal Form (BCNF): In 3NF + for every non-trivial FD X → Y, X must be a super key. Stricter than 3NF — removes all FD-related anomalies.

Example of normalization:
Unnormalized: Student(ID, Name, DeptID, DeptName, CourseName, Grade)
1NF achieved by removing repeating groups.
2NF: Decompose into Student(ID, Name, DeptID) and Enrollment(ID, CourseName, Grade).
3NF: Decompose into Student(ID, Name, DeptID) and Department(DeptID, DeptName).`,
    order: 4,
    pageNumber: 17,
  },
  {
    id: 'dbms-sec-5',
    title: 'Transactions and ACID Properties',
    content: `A transaction is a logical unit of work that accesses and possibly modifies the database contents. Transactions maintain database consistency.

ACID Properties:

Atomicity: A transaction is all-or-nothing. Either all operations succeed (commit) or none of them do (rollback).

Consistency: A transaction brings the database from one valid state to another. All integrity constraints are satisfied before and after.

Isolation: Concurrent transactions execute as if they were serial. Isolation levels:
- READ UNCOMMITTED: Allows dirty reads
- READ COMMITTED: Prevents dirty reads
- REPEATABLE READ: Prevents dirty reads and non-repeatable reads  
- SERIALIZABLE: Full isolation, highest consistency

Durability: Once committed, a transaction remains committed even if the system fails.

Transaction States: Active → Partially Committed → Committed (or Failed → Aborted)

Concurrency Problems:
- Dirty Read: Reading uncommitted data
- Non-repeatable Read: Same query returns different results
- Phantom Read: New rows appear in repeated query
- Lost Update: Two transactions overwrite each other's changes

Locking:
- Shared Lock (S-lock): Multiple reads allowed; writes blocked
- Exclusive Lock (X-lock): Only one transaction reads and writes
- Two-Phase Locking (2PL): Growing phase then Shrinking phase
- Deadlock: Circular waiting — detected using wait-for graphs`,
    order: 5,
    pageNumber: 21,
  },
];

export const DBMS_DOCUMENT_META = {
  name: 'Database Management Systems — Study Guide',
  format: 'txt' as const,
  pageCount: 24,
  wordCount: 2800,
};

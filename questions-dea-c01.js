/* AWS DEA-C01 question bank — generated, do not edit by hand. */
window.QUESTION_BANKS = window.QUESTION_BANKS || {};
window.QUESTION_BANKS['dea-c01'] = [
 {
  "id": "dea-1",
  "source": "authored",
  "domain": 1,
  "topic": "Kinesis Data Streams shard sizing",
  "difficulty": "medium",
  "multi": false,
  "question": "A telemetry platform writes 6 MB/s of sensor records into an Amazon Kinesis data stream in provisioned mode with 4 shards. Producers report a rising rate of ProvisionedThroughputExceededException, and the WriteProvisionedThroughputExceeded metric is non-zero. Traffic is expected to keep growing unpredictably. Which change resolves the errors with the least ongoing administration?",
  "choices": {
   "A": "Switch the stream to on-demand capacity mode so that Kinesis scales shard capacity automatically with the observed write throughput.",
   "B": "Increase the data stream retention period from 24 hours to 168 hours so that records are buffered until capacity frees up.",
   "C": "Add a random suffix to each partition key so that records spread evenly over the existing four shards.",
   "D": "Have producers retry with exponential backoff and enlarge the PutRecords batch size."
  },
  "answer": [
   "A"
  ],
  "explanation": "Each shard ingests 1 MB/s, so 4 shards cap the stream at 4 MB/s while producers push 6 MB/s — the stream is genuinely under-provisioned, not merely hot-keyed. On-demand mode scales capacity automatically as throughput changes and needs no shard math, which suits unpredictable growth. Retention (option B) controls how long records stay readable after they are accepted; it does nothing for writes that are rejected at ingest. Random partition-key suffixes (option C) fix skew across shards, but aggregate capacity is still 4 MB/s, so the writes still fail. Retries and larger batches (option D) reshape the traffic but cannot push more than the provisioned 4 MB/s."
 },
 {
  "id": "dea-2",
  "source": "authored",
  "domain": 1,
  "topic": "Firehose to S3 in Parquet",
  "difficulty": "medium",
  "multi": false,
  "question": "A team streams JSON clickstream events through Amazon Data Firehose into Amazon S3. Analysts query the data with Amazon Athena and complain that scans are slow and expensive. The team wants the delivered objects stored in a columnar format without running a separate batch job. Which approach meets the requirement with the least operational overhead?",
  "choices": {
   "A": "Enable record format conversion on the Firehose stream to convert records to Apache Parquet using a table schema in the AWS Glue Data Catalog.",
   "B": "Add a Firehose data transformation Lambda function that uses a Python library to write Parquet files and returns them as the transformed payload.",
   "C": "Deliver JSON to S3 and schedule an AWS Glue ETL job every hour to rewrite the objects as Parquet.",
   "D": "Enable Firehose dynamic partitioning and set the S3 compression format to Snappy."
  },
  "answer": [
   "A"
  ],
  "explanation": "Firehose has built-in record format conversion that reads a schema from the Glue Data Catalog and writes Parquet or ORC directly, which is exactly the columnar-without-a-batch-job requirement. A transformation Lambda (option B) must return records in the same record-oriented envelope Firehose expects, so it cannot emit a columnar file layout, and it adds code to maintain. A scheduled Glue job (option C) works but is the separate batch job the team wants to avoid, and it doubles storage. Dynamic partitioning with Snappy (option D) improves pruning and shrinks objects but leaves the data row-oriented JSON, so Athena still reads every field of every row it touches."
 },
 {
  "id": "dea-3",
  "source": "authored",
  "domain": 1,
  "topic": "Glue job bookmarks",
  "difficulty": "medium",
  "multi": false,
  "question": "An AWS Glue Spark ETL job runs hourly and reads a raw prefix in Amazon S3 that receives new objects continuously. Downstream analysts report that every run reprocesses the entire prefix, so the run time grows daily and rows are duplicated in the target table. Which change fixes this most directly?",
  "choices": {
   "A": "Enable job bookmarks on the job and use the transformation_ctx parameter on the source and sink so Glue tracks which objects have already been processed.",
   "B": "Reduce the job's worker count so that each run processes fewer files.",
   "C": "Switch the job from the Spark engine to the Python shell engine.",
   "D": "Turn on the Glue Data Catalog crawler on a schedule so the table is refreshed before the job starts."
  },
  "answer": [
   "A"
  ],
  "explanation": "Job bookmarks are Glue's built-in state mechanism for incremental processing: with bookmarks enabled and a transformation_ctx supplied, Glue records the objects (or JDBC keys) already consumed and each run picks up only new data, which stops both the growing run time and the duplicate rows. Fewer workers (option B) make the same full scan slower, not smaller. The Python shell engine (option C) is for small single-node scripts and has no bearing on incrementality. A crawler (option D) updates table metadata and partitions; it does not tell the job which files it already read."
 },
 {
  "id": "dea-4",
  "source": "authored",
  "domain": 1,
  "topic": "DMS full load plus CDC",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must migrate a 4 TB self-managed PostgreSQL database into Amazon Aurora PostgreSQL. The source stays in production during the migration and the cutover window allows only a few minutes of downtime. Which AWS Database Migration Service configuration meets these requirements?",
  "choices": {
   "A": "Run a full load only task, then take a final pg_dump of the changes and apply it manually at cutover.",
   "B": "Run a migration task of type full load and change data capture (CDC), with logical replication enabled on the source, and cut over once the task reaches an ongoing replication state with low target latency.",
   "C": "Run a CDC only task starting from the current log position, since Aurora will backfill history from the source automatically.",
   "D": "Use AWS Snowball Edge to move the data and then repoint the application at Aurora."
  },
  "answer": [
   "B"
  ],
  "explanation": "Full load plus CDC copies the existing 4 TB and then continuously replays changes captured from the source write-ahead log, so the target stays in step and cutover is a short pause once CDCLatencyTarget is near zero. Logical replication (wal_level = logical and the related settings) is the documented prerequisite on a PostgreSQL source. Full load only (option A) leaves a gap that a manual dump cannot close within minutes at this size. CDC only (option C) never copies existing rows — nothing backfills history. Snowball (option D) addresses bandwidth-constrained bulk transfer, not near-zero-downtime cutover of a live database."
 },
 {
  "id": "dea-5",
  "source": "authored",
  "domain": 1,
  "topic": "Step Functions orchestration",
  "difficulty": "medium",
  "multi": false,
  "question": "A nightly pipeline must run an AWS Glue crawler, then a Glue ETL job, then a Redshift stored procedure, and it must send a notification if any step fails. The team wants visual, stateful orchestration with per-step retries and no servers to manage. Which service should orchestrate the pipeline?",
  "choices": {
   "A": "AWS Step Functions, using a state machine with service integrations, Retry blocks and a Catch block that publishes to Amazon SNS.",
   "B": "An Amazon EventBridge rule that invokes all three steps in parallel on a nightly schedule.",
   "C": "A single AWS Lambda function that calls each service in sequence and sleeps between calls.",
   "D": "An Amazon EC2 instance running cron with a shell script that chains the AWS CLI commands."
  },
  "answer": [
   "A"
  ],
  "explanation": "Step Functions is the serverless workflow service: it models the sequence as explicit states, integrates directly with Glue and Redshift Data API, supports per-state Retry with backoff, and a Catch transition can publish the failure to SNS — all visible in the execution graph. An EventBridge rule (option B) can start the workflow but has no notion of ordering or step dependencies. A single Lambda (option C) is bounded by the 15-minute timeout and would burn that time waiting on a crawler and an ETL job. EC2 with cron (option D) reintroduces servers, patching and bespoke error handling."
 },
 {
  "id": "dea-6",
  "source": "authored",
  "domain": 1,
  "topic": "Glue DynamicFrame vs DataFrame",
  "difficulty": "hard",
  "multi": false,
  "question": "An AWS Glue job reads semi-structured JSON in which one field is sometimes a string and sometimes an array of strings. The job currently fails with a schema mismatch when the data is loaded into a Spark DataFrame. Which approach handles the inconsistency with the least custom code?",
  "choices": {
   "A": "Read the data as a Glue DynamicFrame, then use ResolveChoice to project the ambiguous field, or resolve it into separate typed columns.",
   "B": "Define an explicit Spark StructType schema that types the field as a string and discard rows where it is an array.",
   "C": "Run an AWS Glue crawler with the JSON classifier before every job run so the table schema always matches the newest file.",
   "D": "Convert the source files to CSV with an Amazon Athena CTAS statement before the Glue job runs."
  },
  "answer": [
   "A"
  ],
  "explanation": "DynamicFrames were designed for exactly this: they keep a choice type when a field has more than one observed type, and ResolveChoice lets you cast, project a single type, or split the values into typed sibling columns without hand-writing per-row logic. An explicit StructType (option B) silences the error only by throwing away data. A crawler (option C) records the ambiguity in the catalog but does not resolve it at read time — the job still faces both types. Flattening to CSV (option D) is lossy for nested and array values and adds a whole extra stage."
 },
 {
  "id": "dea-7",
  "source": "authored",
  "domain": 1,
  "topic": "Idempotent ingestion",
  "difficulty": "hard",
  "multi": true,
  "question": "An AWS Lambda function is triggered by an Amazon SQS standard queue and writes each message into an Amazon DynamoDB table. Occasionally the same order appears twice in the table. Which TWO changes reduce duplicate writes?",
  "choices": {
   "A": "Use a conditional write with attribute_not_exists on the order ID so a repeated delivery does not create a second item.",
   "B": "Replace the standard queue with an SQS FIFO queue and set a message deduplication ID derived from the order ID.",
   "C": "Increase the Lambda function timeout so that processing always finishes before the visibility timeout expires.",
   "D": "Enable DynamoDB point-in-time recovery so duplicate items can be removed later.",
   "E": "Switch the DynamoDB table to on-demand capacity mode."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "SQS standard queues guarantee at-least-once delivery, so consumers must be idempotent. A conditional PutItem with attribute_not_exists on the key makes the second write a no-op, and a FIFO queue with a deduplication ID suppresses duplicates inside the five-minute dedup window at the queue itself — the two complementary fixes. A longer function timeout (option C) helps only if the duplicate is caused by the visibility timeout expiring mid-processing, which is one narrow cause and is more properly fixed by setting visibility timeout above the function timeout. Point-in-time recovery (option D) is a backup feature and detects nothing. On-demand capacity (option E) addresses throttling, not duplication."
 },
 {
  "id": "dea-8",
  "source": "authored",
  "domain": 1,
  "topic": "Amazon MSK consumers",
  "difficulty": "medium",
  "multi": false,
  "question": "A data engineering team runs Amazon MSK and needs to land every topic message in Amazon S3 as Parquet for the data lake, with no consumer application to operate. Which solution requires the least custom code?",
  "choices": {
   "A": "Create an Amazon Data Firehose stream with the MSK cluster topic as its source, enable record format conversion to Parquet, and deliver to S3.",
   "B": "Run a Kafka Connect S3 sink connector on an Amazon EC2 Auto Scaling group and configure Parquet output.",
   "C": "Write an AWS Lambda function with an MSK event source mapping that buffers records in memory and writes Parquet objects to S3.",
   "D": "Use Amazon EMR with a long-running Spark Structured Streaming application that reads from MSK and writes to S3."
  },
  "answer": [
   "A"
  ],
  "explanation": "Firehose supports Amazon MSK as a source and can convert records to Parquet using a Glue table schema before delivering to S3, which gives a fully managed path with no consumer code at all. A self-managed Kafka Connect cluster on EC2 (option B) means capacity, patching and connector operations. A Lambda consumer (option C) is code the team must write and makes columnar file assembly awkward across invocations. An EMR streaming application (option D) is the most heavyweight of the four and is a long-running cluster to operate."
 },
 {
  "id": "dea-9",
  "source": "authored",
  "domain": 1,
  "topic": "Redshift COPY performance",
  "difficulty": "medium",
  "multi": false,
  "question": "An engineer loads a 500 GB daily extract into Amazon Redshift. The extract is currently a single uncompressed CSV file in Amazon S3, and the COPY command takes several hours. The cluster has 8 compute nodes with 4 slices each. Which change gives the largest load-time improvement?",
  "choices": {
   "A": "Split the extract into many compressed files — ideally a multiple of the cluster's 32 slices — and COPY the prefix so all slices load in parallel.",
   "B": "Run 32 separate COPY commands in parallel, one per slice, each targeting a byte range of the single file.",
   "C": "Wrap the load in a transaction and run VACUUM immediately after the COPY completes.",
   "D": "Increase the cluster's WLM concurrency so the COPY receives more query slots."
  },
  "answer": [
   "A"
  ],
  "explanation": "COPY parallelism comes from the number of input files: a single file is read by one slice, so 31 of 32 slices sit idle. Splitting into many similarly sized compressed files — a multiple of the slice count — lets every slice pull its own file, and compression cuts the S3 transfer. Byte-range COPY commands (option B) are not supported that way and concurrent COPYs into one table serialise anyway. VACUUM (option C) reclaims space and re-sorts after the fact; it makes the overall job longer. WLM concurrency (option D) governs how many queries run at once, not how fast one COPY ingests one file."
 },
 {
  "id": "dea-10",
  "source": "authored",
  "domain": 1,
  "topic": "EventBridge S3 triggers",
  "difficulty": "easy",
  "multi": false,
  "question": "A pipeline must start an AWS Glue workflow within seconds of a new object landing under a specific Amazon S3 prefix. The solution must be event driven rather than polled. Which approach meets the requirement?",
  "choices": {
   "A": "Enable EventBridge notifications on the bucket and create an EventBridge rule matching the Object Created event and the prefix, targeting the Glue workflow.",
   "B": "Schedule the Glue workflow every minute and have the first job list the prefix to see whether anything is new.",
   "C": "Enable S3 Versioning on the bucket so Glue is notified whenever a new version is written.",
   "D": "Turn on S3 Storage Lens and alert on the object count metric."
  },
  "answer": [
   "A"
  ],
  "explanation": "S3 can publish Object Created events to Amazon EventBridge, and an EventBridge rule can filter on bucket and key prefix and start a Glue workflow directly, giving near-real-time, event-driven triggering. Minute-by-minute scheduling (option B) is polling by definition and wastes runs. Versioning (option C) tracks object versions and emits no trigger of its own. Storage Lens (option D) is a daily storage analytics feature with no event path suitable for pipeline triggering."
 },
 {
  "id": "dea-11",
  "source": "authored",
  "domain": 1,
  "topic": "Small files problem",
  "difficulty": "hard",
  "multi": false,
  "question": "An AWS Glue job writes roughly 200,000 files of about 40 KB each per day into Amazon S3. Athena queries over the resulting table have become very slow, and the Glue job itself spends most of its time in the write stage. Which change addresses the root cause?",
  "choices": {
   "A": "Coalesce or repartition the output so each partition writes a small number of files of roughly 128 MB to 512 MB, and periodically compact existing small files.",
   "B": "Move the S3 prefix to S3 Intelligent-Tiering so frequently read files are served faster.",
   "C": "Increase the Athena query timeout and enable result reuse.",
   "D": "Add more Glue workers so the same number of files is written faster."
  },
  "answer": [
   "A"
  ],
  "explanation": "The problem is file count: every tiny object costs a separate request and task on read, and the write stage pays per-file overhead. Producing fewer, larger files — the usual target is a couple of hundred megabytes — and compacting the existing ones fixes both symptoms. Intelligent-Tiering (option B) changes storage cost, not request overhead or throughput. A longer timeout with result reuse (option C) hides the symptom for repeat queries while first-run latency stays bad. More workers (option D) can actually make it worse, since more parallel writers usually mean even more output files."
 },
 {
  "id": "dea-12",
  "source": "authored",
  "domain": 1,
  "topic": "Managed Service for Apache Flink",
  "difficulty": "medium",
  "multi": false,
  "question": "A fraud team needs a five-minute tumbling window count of failed payment attempts per account, computed continuously over a Kinesis data stream, with results written to Amazon DynamoDB in near real time. Which service best fits?",
  "choices": {
   "A": "Amazon Managed Service for Apache Flink, running a streaming application that applies a tumbling window aggregation and sinks the results to DynamoDB.",
   "B": "Amazon Athena, running a windowed SQL query on a schedule against the raw events in Amazon S3.",
   "C": "AWS Glue, running a batch ETL job every five minutes over the last five minutes of data.",
   "D": "Amazon Redshift, loading the stream with COPY every five minutes and using a window function."
  },
  "answer": [
   "A"
  ],
  "explanation": "Tumbling-window aggregation over a live stream with a low-latency sink is the canonical Managed Service for Apache Flink use case — it reads the Kinesis stream continuously, handles windowing and event time, and writes to DynamoDB through a sink connector. Scheduled Athena (option B) queries data only after it has landed in S3, adding minutes of delay. A five-minute Glue batch job (option C) is micro-batching with cluster start overhead each run and no event-time semantics. Redshift with periodic COPY (option D) is a warehouse pattern, not near-real-time stream processing."
 },
 {
  "id": "dea-13",
  "source": "authored",
  "domain": 1,
  "topic": "Glue Schema Registry",
  "difficulty": "medium",
  "multi": false,
  "question": "Several teams produce Avro records to shared Kafka topics. A producer recently added a required field without a default, which broke every consumer. The company wants such changes rejected before the records are published. Which solution meets this requirement?",
  "choices": {
   "A": "Register the schemas in the AWS Glue Schema Registry, have producers serialize through the registry client, and set the schema compatibility mode to BACKWARD so incompatible evolutions are rejected at registration.",
   "B": "Run an AWS Glue crawler over the topic archive in Amazon S3 every hour and alert when the inferred schema changes.",
   "C": "Add a Lambda function on the consumer side that drops records it cannot deserialize.",
   "D": "Store the current Avro schema as a JSON file in Amazon S3 and ask producers to read it before publishing."
  },
  "answer": [
   "A"
  ],
  "explanation": "The Glue Schema Registry enforces a configured compatibility rule at the point of schema registration and serialization, so a producer that introduces a breaking change fails fast rather than poisoning the topic. A crawler over archived data (option B) detects the break only after consumers have already been broken. A consumer-side filter (option C) silently loses records and treats the symptom. A schema file in S3 (option D) is a convention with nothing enforcing it."
 },
 {
  "id": "dea-14",
  "source": "authored",
  "domain": 1,
  "topic": "Firehose dynamic partitioning",
  "difficulty": "medium",
  "multi": false,
  "question": "Events streamed through Amazon Data Firehose into Amazon S3 currently land under a date-based prefix only. Analysts almost always filter by the customer_id field, and their Athena queries scan the whole day. The team wants delivery to write objects into customer-specific prefixes without a post-processing job. What should they do?",
  "choices": {
   "A": "Enable dynamic partitioning on the Firehose stream and use a JQ expression on customer_id to build the S3 prefix.",
   "B": "Enable server-side encryption on the destination bucket and add a bucket key.",
   "C": "Increase the Firehose buffer interval so more records accumulate before delivery.",
   "D": "Create an Athena view that filters on customer_id."
  },
  "answer": [
   "A"
  ],
  "explanation": "Dynamic partitioning lets Firehose extract values from each record — with inline JQ parsing or a Lambda — and use them in the S3 prefix expression, so data lands partitioned by customer_id and Athena can prune whole prefixes. Encryption settings (option B) are unrelated to scan volume. A longer buffer interval (option C) makes larger files, which helps a little but leaves every query scanning all customers. A view (option D) adds a filter but Athena still scans the underlying unpartitioned objects."
 },
 {
  "id": "dea-15",
  "source": "authored",
  "domain": 1,
  "topic": "Amazon AppFlow",
  "difficulty": "easy",
  "multi": false,
  "question": "A company must pull opportunity records from Salesforce into Amazon S3 on a daily schedule, with field mapping and simple filtering, and without writing or maintaining API integration code. Which service is the best fit?",
  "choices": {
   "A": "Amazon AppFlow",
   "B": "AWS Database Migration Service",
   "C": "AWS DataSync",
   "D": "AWS Transfer Family"
  },
  "answer": [
   "A"
  ],
  "explanation": "AppFlow is the managed SaaS integration service: it ships connectors for Salesforce and similar applications, supports scheduled flows, field mapping, filters and masking, and lands results in S3 with no integration code. DMS (option B) migrates relational and a few NoSQL database engines, not SaaS applications. DataSync (option C) moves files between file and object storage. Transfer Family (option D) provides managed SFTP, FTPS and FTP endpoints in front of S3."
 },
 {
  "id": "dea-16",
  "source": "authored",
  "domain": 1,
  "topic": "Athena CTAS and INSERT INTO",
  "difficulty": "medium",
  "multi": false,
  "question": "An analyst needs to build a partitioned, Parquet-formatted derived table in the data lake from an existing raw Athena table, and then append to it each day. The company wants to avoid provisioning any compute. Which approach meets the requirement?",
  "choices": {
   "A": "Use a CREATE TABLE AS SELECT statement in Athena with format Parquet and partitioned_by, then append daily with INSERT INTO.",
   "B": "Use an AWS Glue Spark job with a Parquet sink and job bookmarks.",
   "C": "Use Amazon EMR with a Hive external table and a daily INSERT OVERWRITE.",
   "D": "Use Amazon Redshift Spectrum with an external table and UNLOAD."
  },
  "answer": [
   "A"
  ],
  "explanation": "Athena CTAS writes the query result to S3 in a chosen format with partitioning, and INSERT INTO appends new partitions later — all serverless, with no cluster or job definition. A Glue job (option B) is serverless too but requires authoring and maintaining a job when plain SQL suffices. EMR (option C) means provisioning a cluster, the explicit non-goal. Redshift Spectrum (option D) requires a Redshift cluster or workgroup and UNLOAD writes query output rather than maintaining a partitioned managed table."
 },
 {
  "id": "dea-17",
  "source": "authored",
  "domain": 1,
  "topic": "Kinesis enhanced fan-out",
  "difficulty": "hard",
  "multi": false,
  "question": "Five separate applications each consume the same Kinesis data stream. As consumers were added, end-to-end latency rose above two seconds and consumers began hitting read throughput limits. Which change resolves this?",
  "choices": {
   "A": "Register each consumer as an enhanced fan-out consumer so each gets a dedicated 2 MB/s per shard pipe with HTTP/2 push delivery.",
   "B": "Double the number of shards so that the shared 2 MB/s per shard read limit is divided among fewer consumers.",
   "C": "Increase the stream retention period to seven days.",
   "D": "Have each consumer call GetRecords more frequently with a smaller limit."
  },
  "answer": [
   "A"
  ],
  "explanation": "Standard consumers share a 2 MB/s read budget per shard, so five of them contend and back off; enhanced fan-out gives every registered consumer its own 2 MB/s per shard and pushes records over HTTP/2, typically cutting propagation delay to around 70 ms. Doubling shards (option B) doubles cost and still shares each shard's read budget among all five consumers. Retention (option C) affects how long data is available, not read throughput. Polling harder (option D) raises the rate of ReadProvisionedThroughputExceeded errors rather than lowering it."
 },
 {
  "id": "dea-18",
  "source": "authored",
  "domain": 1,
  "topic": "Glue DataBrew",
  "difficulty": "easy",
  "multi": false,
  "question": "A business analytics team with no Spark experience needs to profile a new dataset, then clean it — trimming whitespace, standardising date formats and removing outliers — and write the cleaned output to Amazon S3 on a schedule. Which service best matches the team's skills?",
  "choices": {
   "A": "AWS Glue DataBrew, using a visual recipe and a scheduled DataBrew job.",
   "B": "An AWS Glue Spark ETL job authored in PySpark.",
   "C": "An Amazon EMR notebook running Scala Spark.",
   "D": "An AWS Lambda function invoked by an EventBridge schedule."
  },
  "answer": [
   "A"
  ],
  "explanation": "DataBrew is the visual data preparation service: it profiles datasets, offers hundreds of point-and-click transformations recorded as a reusable recipe, and runs recipe jobs on a schedule — no code and no Spark knowledge. A PySpark Glue job (option B) and an EMR Scala notebook (option C) both require the programming skill the team lacks. A Lambda function (option D) would mean writing all the cleaning logic by hand and is poorly suited to large datasets."
 },
 {
  "id": "dea-19",
  "source": "authored",
  "domain": 1,
  "topic": "Glue connection to VPC resources",
  "difficulty": "hard",
  "multi": false,
  "question": "An AWS Glue job must read from an Amazon RDS instance in a private subnet and write results to Amazon S3. The job fails with a connection timeout to the database, and after that is fixed it fails again when writing to S3. Which combination of configuration is required?",
  "choices": {
   "A": "Attach a Glue connection for the VPC, subnet and a security group that allows self-referencing traffic, and provide S3 access from the private subnet through a gateway VPC endpoint or a NAT gateway.",
   "B": "Give the Glue job role the AdministratorAccess policy and rerun it.",
   "C": "Move the RDS instance to a public subnet and assign it a public IP address.",
   "D": "Enable S3 Transfer Acceleration on the destination bucket."
  },
  "answer": [
   "A"
  ],
  "explanation": "A Glue job reaching private VPC resources needs a network-type Glue connection naming the VPC, subnet and a security group with a self-referencing rule, which is how Glue places elastic network interfaces in the subnet. Once inside a private subnet, the job has no route to S3 unless the subnet has a gateway endpoint for S3 or a NAT gateway — the second failure. Broad IAM permissions (option B) do not create network paths. Making the database public (option C) is an unnecessary exposure and does not fix the S3 path. Transfer Acceleration (option D) is an internet edge optimisation, irrelevant to a missing route."
 },
 {
  "id": "dea-20",
  "source": "authored",
  "domain": 1,
  "topic": "Zero-ETL and near-real-time analytics",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs its transactional workload on Amazon Aurora MySQL and wants analysts to query near-real-time operational data in Amazon Redshift without building or operating a replication pipeline. Which approach meets this with the least engineering effort?",
  "choices": {
   "A": "Create an Aurora MySQL zero-ETL integration with Amazon Redshift.",
   "B": "Schedule an AWS Glue job every 15 minutes to read changed rows using a last_updated column and COPY them into Redshift.",
   "C": "Configure AWS DMS with a CDC task from Aurora to Amazon S3, then run a Redshift COPY on a schedule.",
   "D": "Enable Aurora backtrack and query the backtracked data from Redshift Spectrum."
  },
  "answer": [
   "A"
  ],
  "explanation": "Zero-ETL integration replicates Aurora data into Redshift continuously as a managed feature — no pipeline to build, schedule or monitor — which is precisely the stated goal. A 15-minute Glue job (option B) is a pipeline with watermark logic to maintain and misses deletes. DMS to S3 plus scheduled COPY (option C) is a working but multi-component pipeline to operate. Backtrack (option D) rewinds an Aurora cluster in place for recovery; it publishes nothing to Redshift and Spectrum cannot read it."
 },
 {
  "id": "dea-21",
  "source": "authored",
  "domain": 1,
  "topic": "Choosing a file format",
  "difficulty": "medium",
  "multi": false,
  "question": "A data lake stores wide fact tables with 180 columns. Analysts typically select 6 to 10 columns and filter on a date range, using Amazon Athena. The team must minimise both storage cost and bytes scanned. Which storage format and layout should they choose?",
  "choices": {
   "A": "Apache Parquet with Snappy compression, partitioned by event date.",
   "B": "Gzip-compressed CSV, partitioned by event date.",
   "C": "Apache Avro with Deflate compression, partitioned by event date.",
   "D": "Newline-delimited JSON with Bzip2 compression, unpartitioned."
  },
  "answer": [
   "A"
  ],
  "explanation": "Parquet is columnar, so Athena reads only the 6 to 10 projected columns and can skip row groups using min/max statistics; Snappy is splittable and fast to decompress, and date partitioning prunes whole prefixes. Gzip CSV (option B) is row oriented, so every column is read, and a single gzip object is not splittable. Avro (option C) is row oriented too — excellent for streaming and schema evolution, poor for wide column projection. Unpartitioned Bzip2 JSON (option D) is the worst case: verbose, row oriented, CPU-expensive to decompress and impossible to prune."
 },
 {
  "id": "dea-22",
  "source": "authored",
  "domain": 1,
  "topic": "Amazon MWAA",
  "difficulty": "medium",
  "multi": false,
  "question": "A company already maintains dozens of Apache Airflow DAGs on premises and wants to move them to AWS with minimal rewriting, keeping the same operators and scheduling semantics. Which service should they use?",
  "choices": {
   "A": "Amazon Managed Workflows for Apache Airflow (MWAA), pointing the environment at a DAGs folder in Amazon S3.",
   "B": "AWS Step Functions, rewriting each DAG as an Amazon States Language state machine.",
   "C": "AWS Glue workflows, rebuilding each DAG from triggers and jobs.",
   "D": "Amazon EventBridge Scheduler, with one schedule per task."
  },
  "answer": [
   "A"
  ],
  "explanation": "MWAA runs upstream Apache Airflow as a managed service, so existing DAG files, operators and dependencies move across by uploading them to the environment's S3 DAGs folder — the minimal-rewrite requirement. Step Functions (option B) and Glue workflows (option C) are perfectly good orchestrators but require every DAG to be re-authored in a different model. EventBridge Scheduler (option D) fires events on a schedule and has no dependency graph, so inter-task ordering would have to be rebuilt by hand."
 },
 {
  "id": "dea-23",
  "source": "authored",
  "domain": 1,
  "topic": "Kinesis partition key skew",
  "difficulty": "hard",
  "multi": false,
  "question": "A Kinesis data stream has 10 shards and an aggregate write rate well below capacity, yet one shard consistently throttles producers. Records are partitioned by store_id, and one flagship store generates most of the traffic. Which change fixes the throttling while keeping per-store ordering for all other stores?",
  "choices": {
   "A": "Use a composite partition key that appends a bounded random salt only for the hot store, and have the consumer merge that store's sub-streams.",
   "B": "Set the partition key to a fully random UUID for every record.",
   "C": "Switch to enhanced fan-out consumers.",
   "D": "Increase the stream retention period so throttled records are retried later."
  },
  "answer": [
   "A"
  ],
  "explanation": "The stream is hot-keyed, not under-provisioned: all traffic for the flagship store hashes to one shard whose 1 MB/s limit is the ceiling. Salting only that key spreads its records across several shards while every other store keeps a single stable key and therefore keeps per-key ordering. A random UUID for every record (option B) fixes the skew but destroys ordering for all stores. Enhanced fan-out (option C) increases read capacity and does nothing about write throttling. Retention (option D) governs how long accepted records live, not whether writes are accepted."
 },
 {
  "id": "dea-24",
  "source": "authored",
  "domain": 1,
  "topic": "Firehose buffering trade-off",
  "difficulty": "easy",
  "multi": false,
  "question": "An Amazon Data Firehose stream delivering to Amazon S3 is configured with a 1 MiB buffer size and a 60-second buffer interval. The team finds thousands of small objects in the bucket and wants larger files, accepting up to five minutes of delivery delay. What should they change?",
  "choices": {
   "A": "Increase the buffer size to 128 MiB and the buffer interval to 300 seconds.",
   "B": "Decrease the buffer interval to 30 seconds so files are written more predictably.",
   "C": "Enable source record backup to a second S3 bucket.",
   "D": "Switch the destination from Amazon S3 to Amazon OpenSearch Service."
  },
  "answer": [
   "A"
  ],
  "explanation": "Firehose flushes whenever either buffer condition is met first, so raising both the size and the interval lets more records accumulate per object, producing fewer and larger files within the accepted five-minute delay. Lowering the interval (option B) flushes sooner and makes the small-file problem worse. Source record backup (option C) writes an additional copy of the raw records and doubles object count. Changing the destination (option D) abandons the requirement rather than meeting it."
 },
 {
  "id": "dea-25",
  "source": "authored",
  "domain": 1,
  "topic": "SQS versus Kinesis",
  "difficulty": "medium",
  "multi": false,
  "question": "An architecture must let four independent teams each read the full history of the last 24 hours of events, replaying from an arbitrary point when a bug is fixed. Ordering within each device must be preserved. Which service fits best?",
  "choices": {
   "A": "Amazon Kinesis Data Streams, with each team running its own consumer application and checkpoint.",
   "B": "Amazon SQS standard queues, one queue per team, fed by a fan-out Lambda function.",
   "C": "Amazon SQS FIFO queues, one queue per team.",
   "D": "Amazon SNS with four subscriptions."
  },
  "answer": [
   "A"
  ],
  "explanation": "Kinesis is a durable, replayable log: records stay for the retention period, several consumer applications read the same stream independently with their own checkpoints, and records with the same partition key stay ordered — all three requirements. SQS queues (options B and C) delete messages once consumed, so there is no replay from an arbitrary point, and FIFO adds ordering but still no history. SNS (option D) is push-only fan-out with no retention and no replay."
 },
 {
  "id": "dea-26",
  "source": "authored",
  "domain": 1,
  "topic": "Glue Spark out of memory",
  "difficulty": "hard",
  "multi": true,
  "question": "An AWS Glue Spark job joining a 2 TB fact table to a 30 MB dimension table fails with executor out-of-memory errors and shows heavy shuffle spill. Which TWO changes are most likely to fix the job?",
  "choices": {
   "A": "Broadcast the small dimension table so the join avoids a full shuffle of the fact table.",
   "B": "Repartition the fact table on the join key and increase the number of shuffle partitions so each task handles less data.",
   "C": "Set the job's worker type to the smallest available so more workers can be scheduled.",
   "D": "Call collect() on the fact DataFrame before the join to materialise it on the driver.",
   "E": "Disable job bookmarks so Spark reprocesses everything in one pass."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A 30 MB dimension is well inside broadcast range, and broadcasting it turns the shuffle-heavy join into a map-side join, which is the single biggest win. Increasing shuffle partitions and repartitioning on the join key shrinks each task's working set, which is the standard remedy for spill and executor OOM. The smallest worker type (option C) reduces memory per executor and makes OOM more likely. collect() (option D) would pull 2 TB onto the driver and is guaranteed to fail. Bookmarks (option E) control incrementality, not memory, and disabling them enlarges the input."
 },
 {
  "id": "dea-27",
  "source": "authored",
  "domain": 1,
  "topic": "Glue workflows and triggers",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants a crawler to run, then two ETL jobs to run in parallel, then a final job to run only if both parallel jobs succeed — all defined inside AWS Glue itself without another orchestration service. Which Glue feature provides this?",
  "choices": {
   "A": "A Glue workflow with an on-demand or scheduled trigger to start the crawler and conditional triggers that watch job states.",
   "B": "A Glue job with three separate script files invoked from a single entry point.",
   "C": "Three Glue crawlers chained by S3 event notifications.",
   "D": "A Glue Data Catalog resource policy referencing the job ARNs."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue workflows model exactly this: a start trigger, then conditional triggers that fire when the watched jobs or crawlers reach a state such as SUCCEEDED, with AND logic across several predecessors — a fan-out then fan-in graph entirely inside Glue. Chaining scripts inside one job (option B) loses per-step retry, parallelism and visibility. Crawlers linked by S3 events (option C) are for cataloguing, not job dependency. A catalog resource policy (option D) is an access-control document and orchestrates nothing."
 },
 {
  "id": "dea-28",
  "source": "authored",
  "domain": 1,
  "topic": "AWS DataSync",
  "difficulty": "easy",
  "multi": false,
  "question": "A company must copy 40 TB from an on-premises NFS share to Amazon S3 over an existing 1 Gbps AWS Direct Connect link, then keep the S3 copy in sync with a nightly incremental transfer that verifies data integrity. Which service should they use?",
  "choices": {
   "A": "AWS DataSync, with an agent deployed on premises and a scheduled task.",
   "B": "AWS Snowball Edge, shipped once per night.",
   "C": "AWS Storage Gateway in volume gateway mode.",
   "D": "Amazon S3 Transfer Acceleration with the AWS CLI sync command."
  },
  "answer": [
   "A"
  ],
  "explanation": "DataSync is purpose-built for this: an on-premises agent reads the NFS share, transfers over Direct Connect, moves only changed files on later runs, verifies integrity end to end and supports scheduling. Snowball (option B) is for offline bulk transfer when bandwidth is the constraint and cannot serve a nightly sync. Volume Gateway (option C) presents iSCSI block volumes backed by S3, which is a different storage model, not a file-to-object migration. Transfer Acceleration with CLI sync (option D) optimises internet uploads, does not use Direct Connect and lacks DataSync's verification and scheduling."
 },
 {
  "id": "dea-29",
  "source": "authored",
  "domain": 1,
  "topic": "Lambda concurrency and downstream limits",
  "difficulty": "hard",
  "multi": false,
  "question": "A Lambda function triggered by Amazon S3 events writes to an Amazon RDS for PostgreSQL database. During a large backfill, thousands of concurrent invocations exhaust the database connection limit and the pipeline fails. Which change fixes this most appropriately?",
  "choices": {
   "A": "Set a reserved concurrency limit on the function and route database traffic through Amazon RDS Proxy so connections are pooled and reused.",
   "B": "Increase the function memory so each invocation completes faster and holds its connection for less time.",
   "C": "Move the function into a larger VPC CIDR range to allow more elastic network interfaces.",
   "D": "Switch the S3 trigger to an EventBridge rule so the events are delivered more slowly."
  },
  "answer": [
   "A"
  ],
  "explanation": "The failure is connection exhaustion driven by unbounded fan-out. Reserved concurrency caps how many invocations run at once, and RDS Proxy multiplexes many short-lived Lambda connections onto a small pool of database connections — together they bound the load the database sees. More memory (option B) shortens each invocation but does not bound concurrency, so the peak still overwhelms the database. A larger CIDR (option C) avoids ENI address exhaustion, a different failure. EventBridge (option D) does not throttle delivery, so the fan-out is unchanged."
 },
 {
  "id": "dea-30",
  "source": "authored",
  "domain": 1,
  "topic": "Glue Studio visual ETL",
  "difficulty": "easy",
  "multi": false,
  "question": "A junior engineer must build a simple Glue ETL job that reads a catalog table, drops two columns, filters rows and writes Parquet to Amazon S3. The team wants the resulting job to be a normal Glue job that can be version controlled and scheduled. What is the most efficient way to author it?",
  "choices": {
   "A": "Build the job in AWS Glue Studio's visual editor, which generates the PySpark script that can then be exported and scheduled like any other Glue job.",
   "B": "Write the PySpark script from scratch in a local IDE and upload it to Amazon S3.",
   "C": "Use AWS Glue DataBrew, since DataBrew recipes are Glue jobs.",
   "D": "Use an Athena CTAS query and schedule it with cron on an EC2 instance."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue Studio's visual editor composes source, transform and target nodes and generates a real PySpark Glue job script, so the output is an ordinary Glue job that can be committed to source control, parameterised and scheduled — the fastest path for someone new to Spark. Writing from scratch (option B) works but is slower and more error prone for a trivial transformation. DataBrew (option C) produces recipe jobs, which are a separate job type, not a Glue Spark job. Cron on EC2 (option D) reintroduces a server the team does not need."
 },
 {
  "id": "dea-31",
  "source": "authored",
  "domain": 1,
  "topic": "Redshift UNLOAD",
  "difficulty": "medium",
  "multi": false,
  "question": "A team must export the result of a large Amazon Redshift query to Amazon S3 as compressed Parquet so the data lake can query it with Athena. The export must run in parallel across the cluster. Which command should they use?",
  "choices": {
   "A": "UNLOAD with FORMAT PARQUET and PARTITION BY, writing to an S3 prefix using an IAM role.",
   "B": "COPY with the FORMAT AS PARQUET option targeting the S3 prefix.",
   "C": "CREATE EXTERNAL TABLE followed by INSERT, using Redshift Spectrum.",
   "D": "SELECT the rows through the Redshift Data API and write them with a Lambda function."
  },
  "answer": [
   "A"
  ],
  "explanation": "UNLOAD is the Redshift export command: it writes query results to S3 in parallel from every slice, supports Parquet output and PARTITION BY for a partitioned lake layout, and authenticates with an IAM role. COPY (option B) loads data into Redshift, it is the opposite direction. Spectrum external tables (option C) are read-oriented; INSERT into an external table is supported only for specific external catalogs and is far more convoluted here. Pulling rows through the Data API into Lambda (option D) is single-threaded, size-limited and slow."
 },
 {
  "id": "dea-32",
  "source": "authored",
  "domain": 1,
  "topic": "EMR cluster type selection",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs a nightly two-hour Spark job on Amazon EMR that is fault tolerant and can be restarted. The team wants the lowest cost and is willing to handle interruptions. How should the cluster be provisioned?",
  "choices": {
   "A": "A transient cluster using instance fleets, with On-Demand core nodes and Spot task nodes, terminating when the step completes.",
   "B": "A long-running cluster with all nodes on Spot Instances, kept up 24 hours a day.",
   "C": "A long-running cluster with all nodes On-Demand and a Reserved Instance for each.",
   "D": "A transient cluster with all nodes on Spot Instances, including the primary node."
  },
  "answer": [
   "A"
  ],
  "explanation": "A transient cluster exists only for the two hours of work, so nothing is paid the other twenty-two. Keeping core nodes On-Demand protects HDFS data and cluster stability, while task nodes on Spot supply cheap interruptible compute — the standard EMR cost pattern. An always-on Spot cluster (option B) pays for idle time and risks losing core capacity. All On-Demand with Reserved Instances (option C) commits to capacity used two hours a day. Spot for the primary node (option D) means an interruption kills the entire cluster."
 },
 {
  "id": "dea-33",
  "source": "authored",
  "domain": 1,
  "topic": "Change data capture into a data lake",
  "difficulty": "hard",
  "multi": false,
  "question": "A data lake ingests CDC records from a relational source. Analysts must always see the current state of each row, including deletes, and must also be able to query the state as of any day in the past 90 days. Which target design meets both requirements?",
  "choices": {
   "A": "Write the CDC stream into an Apache Iceberg table with MERGE INTO for upserts and deletes, and use Iceberg time travel or snapshot queries for historical state.",
   "B": "Append every CDC record as a new row in a Parquet table partitioned by ingest date, and have analysts filter for the latest row per key.",
   "C": "Overwrite a Parquet table each night with a full snapshot of the source and keep 90 nightly prefixes.",
   "D": "Load the CDC records into Amazon DynamoDB and query it with PartiQL."
  },
  "answer": [
   "A"
  ],
  "explanation": "Iceberg brings row-level MERGE INTO — so an update or delete is applied to the table rather than appended — plus snapshot-based time travel, which answers the as-of query directly. Append-only Parquet with a latest-row filter (option B) puts a window function in every query and cannot express deletes cleanly. Nightly full snapshots (option C) give history at daily granularity but require a full extract every night and miss intra-day state. DynamoDB (option D) serves point lookups well but is a poor fit for analytical scans and has no built-in 90-day time travel."
 },
 {
  "id": "dea-34",
  "source": "authored",
  "domain": 1,
  "topic": "Kinesis Producer Library aggregation",
  "difficulty": "medium",
  "multi": false,
  "question": "An application sends 500-byte records to a Kinesis data stream at 40,000 records per second. Throughput is only 20 MB/s but producers are throttled on the records-per-second limit. Which change addresses the limit most effectively?",
  "choices": {
   "A": "Use the Kinesis Producer Library with aggregation so many user records are packed into each Kinesis record before being sent.",
   "B": "Increase each record's size by padding it to 25 KB so fewer records are needed.",
   "C": "Switch every producer from PutRecords to PutRecord.",
   "D": "Enable server-side encryption on the stream."
  },
  "answer": [
   "A"
  ],
  "explanation": "Each shard accepts 1,000 records per second as well as 1 MB/s, and tiny records hit the record-count ceiling long before the byte ceiling. KPL aggregation packs many user records into a single Kinesis record, so the count limit stops being the bottleneck, and the Kinesis Client Library de-aggregates transparently on the consumer side. Padding records (option B) wastes bandwidth and cost to game a limit. PutRecord (option C) sends one record per API call and is strictly worse than the batched PutRecords. Encryption (option D) has no bearing on throughput limits."
 },
 {
  "id": "dea-35",
  "source": "authored",
  "domain": 1,
  "topic": "Data pipeline retries and dead letters",
  "difficulty": "medium",
  "multi": false,
  "question": "An event-driven transformation Lambda occasionally fails on malformed records, and those events are lost. The team needs failed events preserved for later inspection and replay, with no change to the happy path. What should they configure?",
  "choices": {
   "A": "Configure an on-failure destination or dead-letter queue on the function so events that exhaust retries are delivered to Amazon SQS with the failure context.",
   "B": "Increase the function's retry attempts to the maximum and rely on eventual success.",
   "C": "Write a try/except block that logs the record to Amazon CloudWatch Logs and returns success.",
   "D": "Enable Lambda provisioned concurrency."
  },
  "answer": [
   "A"
  ],
  "explanation": "An on-failure destination — or a dead-letter queue — captures events that exhausted retries, along with the error context, into SQS where they can be inspected and replayed, with no change to successful invocations. More retries (option B) cannot succeed against a genuinely malformed record. Logging and returning success (option C) puts the payload in logs, which are hard to replay and eventually expire, and it hides failures from metrics. Provisioned concurrency (option D) addresses cold starts."
 },
 {
  "id": "dea-36",
  "source": "authored",
  "domain": 1,
  "topic": "Glue streaming ETL",
  "difficulty": "medium",
  "multi": false,
  "question": "A team needs to enrich a Kinesis stream with a reference dataset in Amazon S3 and write the enriched output continuously to a data lake table, using PySpark code the team already owns. Which service runs this with the least infrastructure to manage?",
  "choices": {
   "A": "An AWS Glue streaming ETL job, which runs the Spark Structured Streaming code as a managed continuous job.",
   "B": "An Amazon EMR cluster with a Spark Structured Streaming step and an Auto Scaling policy.",
   "C": "Amazon Data Firehose with a transformation Lambda that performs the lookup per record.",
   "D": "An Amazon EC2 Auto Scaling group running spark-submit in client mode."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue streaming jobs run Spark Structured Streaming continuously on serverless Glue capacity, so existing PySpark enrichment code runs unchanged with no cluster to size or patch. EMR (option B) runs the same code but hands back cluster management. A Firehose transformation Lambda (option C) would need bespoke per-record lookup logic and discards the team's Spark code. Self-managed EC2 (option D) is the most operational effort of all."
 },
 {
  "id": "dea-37",
  "source": "authored",
  "domain": 1,
  "topic": "Backfill strategy",
  "difficulty": "hard",
  "multi": false,
  "question": "A bug in a transformation corrupted 60 days of a partitioned Parquet table in Amazon S3. The pipeline is idempotent per partition and the raw source data is intact. The team must reprocess the 60 days without pausing the daily job or leaving the table in a partially corrected state for readers. Which approach is best?",
  "choices": {
   "A": "Reprocess each day into a staging prefix, validate the output, then atomically swap the affected partitions in the catalog to point at the corrected locations.",
   "B": "Delete the 60 days of partitions first, then rerun the pipeline day by day so readers see only correct data.",
   "C": "Rerun the daily job 60 times with an overridden date parameter, writing in place with overwrite mode.",
   "D": "Restore the bucket to a 60-day-old state using S3 Versioning and let the daily job catch up."
  },
  "answer": [
   "A"
  ],
  "explanation": "Writing corrected output to a staging location, validating it, then repointing partition metadata makes each partition switch atomic from a reader's point of view, and the daily job keeps running against untouched current partitions. Deleting first (option B) guarantees a long window where readers see missing data. In-place overwrite (option C) exposes readers to half-written partitions and is unsafe if a run fails midway. Rolling the bucket back with versioning (option D) reverts good data too and makes the daily job replay 60 days of unrelated work."
 },
 {
  "id": "dea-38",
  "source": "authored",
  "domain": 1,
  "topic": "Transfer Family",
  "difficulty": "easy",
  "multi": false,
  "question": "Partners upload nightly files using SFTP with their existing client software and SSH key pairs. The company wants those files to land directly in Amazon S3 and does not want to run SFTP servers. Which service meets this requirement?",
  "choices": {
   "A": "AWS Transfer Family with an SFTP-enabled server backed by Amazon S3.",
   "B": "AWS DataSync with an agent installed at each partner site.",
   "C": "Amazon S3 presigned URLs distributed to each partner nightly.",
   "D": "AWS Storage Gateway file gateway deployed in the partner data centres."
  },
  "answer": [
   "A"
  ],
  "explanation": "Transfer Family provides fully managed SFTP endpoints that write straight into S3 and supports SSH public key authentication, so partners keep their existing clients and credentials. DataSync (option B) would require the company to deploy and manage agents inside third-party networks. Presigned URLs (option C) require partners to change to an HTTP-based workflow. A file gateway in partner data centres (option D) is an appliance the company cannot reasonably operate in someone else's environment."
 },
 {
  "id": "dea-39",
  "source": "authored",
  "domain": 1,
  "topic": "Deduplicating streaming data",
  "difficulty": "hard",
  "multi": false,
  "question": "A streaming pipeline reads from Kinesis and writes to an Amazon S3 data lake. Because the consumer checkpoints after writing, a failure can replay records and produce duplicate rows. The team needs exactly-once semantics in the lake table without a nightly dedup job. Which approach achieves this?",
  "choices": {
   "A": "Write to an Apache Iceberg or Apache Hudi table keyed on a record identifier so replays perform an upsert rather than an append.",
   "B": "Increase the checkpoint frequency so fewer records are replayed after a failure.",
   "C": "Enable S3 Versioning so duplicate writes create versions rather than new rows.",
   "D": "Switch the stream to on-demand capacity mode."
  },
  "answer": [
   "A"
  ],
  "explanation": "Duplicates arise because an append-only writer cannot recognise a record it has already written. A transactional table format keyed on a record identifier converts the replayed write into an upsert, so the row count is correct without a scheduled dedup pass. More frequent checkpoints (option B) reduce the size of the duplicate window but never eliminate it. Versioning (option C) tracks object versions and does nothing about duplicate rows inside a table. Capacity mode (option D) is unrelated to consumer replay semantics."
 },
 {
  "id": "dea-40",
  "source": "authored",
  "domain": 1,
  "topic": "Choosing between Glue and EMR",
  "difficulty": "medium",
  "multi": true,
  "question": "A team is deciding between AWS Glue and Amazon EMR for a new Spark workload. Which TWO statements correctly describe when AWS Glue is the better choice?",
  "choices": {
   "A": "The workload is intermittent and the team wants serverless Spark capacity with no cluster to size, patch or terminate.",
   "B": "The pipeline benefits from tight integration with the AWS Glue Data Catalog, crawlers and job bookmarks.",
   "C": "The team needs to run HBase, Presto and Hive alongside Spark on the same cluster with custom bootstrap actions.",
   "D": "The workload requires a specific patched Spark build and fine-grained control over YARN scheduler configuration.",
   "E": "The workload must run continuously on Reserved Instances to minimise cost at very high sustained utilisation."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Glue's strengths are serverless, per-job capacity for intermittent work and its native catalog, crawler and bookmark integration, which remove a great deal of pipeline plumbing. EMR is the better choice for the other three: multi-framework clusters with bootstrap actions (option C), precise control over Spark builds and YARN configuration (option D), and sustained high-utilisation workloads where Reserved or Spot instance pricing beats per-DPU billing (option E)."
 },
 {
  "id": "dea-41",
  "source": "authored",
  "domain": 1,
  "topic": "Redshift streaming ingestion",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants dashboard queries in Amazon Redshift to reflect Kinesis stream data within seconds. The team wants to avoid staging the records in Amazon S3 and running COPY. Which approach meets the requirement?",
  "choices": {
   "A": "Use Redshift streaming ingestion: create an external schema over the Kinesis stream and a materialized view on it, refreshed automatically.",
   "B": "Deliver the stream to S3 with Amazon Data Firehose and schedule a COPY every 60 seconds.",
   "C": "Use Redshift Spectrum with an external table over the Kinesis stream.",
   "D": "Use the Redshift Data API from a Lambda function invoked per record with an INSERT statement."
  },
  "answer": [
   "A"
  ],
  "explanation": "Streaming ingestion connects Redshift directly to a Kinesis data stream or MSK topic through an external schema, and a materialized view over that schema pulls records with low latency — no S3 staging and no COPY. Firehose plus COPY (option B) is the staged pattern the team explicitly wants to avoid and adds buffering delay. Spectrum (option C) reads S3 objects through the Glue catalog and cannot target a stream. Per-record INSERT via the Data API (option D) is catastrophically slow in a columnar warehouse and would throttle immediately."
 },
 {
  "id": "dea-42",
  "source": "authored",
  "domain": 1,
  "topic": "Relationalize nested JSON",
  "difficulty": "hard",
  "multi": false,
  "question": "An AWS Glue job ingests deeply nested JSON in which each order contains an array of line items. Analysts need one row per line item in a flat table. Which transformation should the job apply?",
  "choices": {
   "A": "Use the Relationalize transform on the DynamicFrame, or explode the array in Spark, to pivot the nested array into separate rows joined by a generated key.",
   "B": "Use the DropNullFields transform, then write the result as Parquet.",
   "C": "Use ResolveChoice with the make_struct action on the order column.",
   "D": "Use ApplyMapping to rename the array column to line_items and cast it to string."
  },
  "answer": [
   "A"
  ],
  "explanation": "Relationalize unnests a DynamicFrame, producing a root frame plus child frames for each array — one row per element — linked by generated join keys; the Spark equivalent is explode. That is exactly the one-row-per-line-item requirement. DropNullFields (option B) removes all-null columns and does nothing to nesting. ResolveChoice with make_struct (option C) handles type ambiguity, a different problem. ApplyMapping to a string (option D) would stringify the array, leaving analysts to parse JSON in SQL."
 },
 {
  "id": "dea-43",
  "source": "authored",
  "domain": 1,
  "topic": "EMR Serverless",
  "difficulty": "medium",
  "multi": false,
  "question": "A team has a large existing library of Spark applications with custom dependencies and wants to run them on demand without sizing or managing clusters, while keeping the standard Spark submit interface. Which service fits best?",
  "choices": {
   "A": "Amazon EMR Serverless, submitting jobs to an application that provisions capacity automatically.",
   "B": "Amazon EMR on EC2 with instance fleets and managed scaling.",
   "C": "AWS Lambda with a container image that bundles Spark.",
   "D": "AWS Batch with a Spark container on Amazon ECS."
  },
  "answer": [
   "A"
  ],
  "explanation": "EMR Serverless runs Spark jobs against an application that scales workers up and down automatically, keeps the familiar spark-submit style entry point and supports custom dependencies through images and archives — no cluster sizing. EMR on EC2 (option B) still exposes cluster lifecycle decisions. Lambda (option C) is bounded by a 15-minute timeout and 10 GB of memory, which does not suit general Spark workloads. AWS Batch with Spark containers (option D) means assembling and operating the Spark runtime and scheduling yourself."
 },
 {
  "id": "dea-44",
  "source": "authored",
  "domain": 1,
  "topic": "Lambda event source mapping tuning",
  "difficulty": "hard",
  "multi": true,
  "question": "A Lambda function consuming a Kinesis data stream is falling behind: IteratorAge is climbing steadily even though the function itself is fast. The stream has 20 shards. Which TWO settings would most directly increase consumer throughput?",
  "choices": {
   "A": "Increase the ParallelizationFactor on the event source mapping so more concurrent batches are processed per shard.",
   "B": "Increase the batch size so each invocation processes more records per call.",
   "C": "Decrease the batch window to zero so invocations start sooner.",
   "D": "Enable a Lambda function URL for the consumer.",
   "E": "Increase the stream's retention period to 168 hours."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "With one Lambda invocation per shard by default, throughput is capped at 20 concurrent batches. Raising ParallelizationFactor allows up to ten concurrent batches per shard while preserving per-partition-key ordering, and a larger batch size amortises invocation overhead across more records — both raise records processed per second. A zero batch window (option C) reduces latency for sparse streams but shrinks batches, which usually lowers throughput on a backlog. A function URL (option D) is an HTTP endpoint, irrelevant to a stream consumer. Longer retention (option E) buys time before data loss but does not drain the backlog."
 },
 {
  "id": "dea-45",
  "source": "authored",
  "domain": 1,
  "topic": "Slowly changing dimensions",
  "difficulty": "hard",
  "multi": false,
  "question": "A warehouse must keep full history of customer address changes so that historical orders join to the address that was in effect at order time. Which dimension design meets this requirement?",
  "choices": {
   "A": "A type 2 slowly changing dimension with surrogate keys plus effective start and end timestamps and a current-row flag.",
   "B": "A type 1 slowly changing dimension that overwrites the address column on each change.",
   "C": "A single denormalised fact table that stores the current address on every fact row and is updated nightly.",
   "D": "A dimension table with the address stored as a JSON array of all past values."
  },
  "answer": [
   "A"
  ],
  "explanation": "Type 2 is the standard technique for preserving history: each change closes the previous row and inserts a new one with a new surrogate key and validity window, so a fact row joined on the surrogate key resolves to the address in effect at the time. Type 1 (option B) overwrites and destroys exactly the history required. Restating every fact row nightly (option C) rewrites immutable history and is enormously expensive. A JSON array (option D) stores the values but leaves every query to hand-parse and range-match, defeating the point of a dimensional model."
 },
 {
  "id": "dea-46",
  "source": "authored",
  "domain": 1,
  "topic": "Glue crawler configuration",
  "difficulty": "medium",
  "multi": false,
  "question": "An AWS Glue crawler over an S3 prefix containing a single logical dataset is creating dozens of separate tables, one per date folder. What configuration change makes the crawler produce a single partitioned table?",
  "choices": {
   "A": "Set the crawler's table grouping behaviour to create a single schema for S3 paths and confirm the folders follow a consistent key=value or positional partition layout under one root prefix.",
   "B": "Set the crawler to run on a schedule of once per day instead of on demand.",
   "C": "Add a Grok custom classifier for the file format.",
   "D": "Enable the crawler option to update all new and existing partitions with the metadata from the table."
  },
  "answer": [
   "A"
  ],
  "explanation": "Crawlers split a prefix into multiple tables when the schemas or paths look unrelated; enabling the single-schema grouping option — with the data laid out under one root prefix in a consistent partition structure — makes the crawler infer one table with partitions instead. Scheduling (option B) changes when it runs, not what it produces. A Grok classifier (option C) helps parse unusual text formats but does not merge tables. The partition metadata update option (option D) propagates column changes to existing partitions of an already correct table."
 },
 {
  "id": "dea-47",
  "source": "authored",
  "domain": 1,
  "topic": "Athena federated query",
  "difficulty": "medium",
  "multi": false,
  "question": "An analyst must join data in Amazon S3 with reference data that lives in an Amazon DynamoDB table, using a single SQL statement and without copying the DynamoDB data into the lake. Which capability supports this?",
  "choices": {
   "A": "Athena Federated Query with the DynamoDB data source connector deployed as a Lambda function.",
   "B": "An AWS Glue crawler pointed at the DynamoDB table so it appears in the Data Catalog as an S3 table.",
   "C": "Redshift Spectrum with an external schema over DynamoDB.",
   "D": "An Athena view that uses the dynamodb:// URI scheme in the FROM clause."
  },
  "answer": [
   "A"
  ],
  "explanation": "Athena Federated Query runs a Lambda-based connector — including a supported DynamoDB connector — that lets a single Athena query read the external source and join it to S3-backed tables live, with no copy. A crawler (option B) can catalog a DynamoDB table's schema but the resulting table is not an S3 table and this alone does not give Athena the ability to read it. Spectrum (option C) reads S3 through the catalog and does not federate to DynamoDB. There is no dynamodb:// URI scheme in Athena SQL (option D)."
 },
 {
  "id": "dea-48",
  "source": "authored",
  "domain": 1,
  "topic": "Glue job cost with Flex",
  "difficulty": "medium",
  "multi": false,
  "question": "A nightly AWS Glue ETL job is not time sensitive: it must finish before 07:00 but the exact completion time does not matter. The team wants to cut the job's cost. Which option is most appropriate?",
  "choices": {
   "A": "Run the job with the Flex execution class, which uses spare capacity at a lower price for non-urgent jobs.",
   "B": "Reduce the number of workers to one and accept a longer run time.",
   "C": "Switch the job to the Python shell job type with 1 DPU.",
   "D": "Set a shorter job timeout so a slow run is cancelled before it costs more."
  },
  "answer": [
   "A"
  ],
  "explanation": "Flex execution runs Glue Spark jobs on spare capacity at a reduced rate, trading predictable start and run times for cost — an exact match for a job with a loose deadline. Cutting to one worker (option B) can raise cost, since the job may run many times longer at nearly the same per-DPU-hour rate, and risks missing the deadline. A Python shell job (option C) is single-node and cannot run a Spark ETL workload of this kind. A shorter timeout (option D) cancels work rather than making it cheaper."
 },
 {
  "id": "dea-49",
  "source": "authored",
  "domain": 1,
  "topic": "EventBridge Pipes",
  "difficulty": "medium",
  "multi": false,
  "question": "A team needs to move records from a DynamoDB stream to an Amazon SQS queue, filtering out records whose event type is REMOVE and enriching the rest with a Lambda call, using as little custom plumbing as possible. Which service provides this point-to-point integration natively?",
  "choices": {
   "A": "Amazon EventBridge Pipes, with a source filter, an enrichment step and a target.",
   "B": "An EventBridge event bus rule with an input transformer.",
   "C": "AWS Step Functions Express Workflows polling the stream.",
   "D": "AWS Glue streaming ETL reading the DynamoDB stream."
  },
  "answer": [
   "A"
  ],
  "explanation": "EventBridge Pipes is designed for exactly this shape: one source such as a DynamoDB stream, an optional filter evaluated before invocation, an optional enrichment step such as a Lambda function, and one target — all configuration, no polling code. An event bus rule (option B) cannot consume a DynamoDB stream as a source. Step Functions (option C) has no stream poller of its own, so something must feed it. Glue streaming (option D) is a Spark job, far heavier than needed and not a DynamoDB stream consumer."
 },
 {
  "id": "dea-50",
  "source": "authored",
  "domain": 1,
  "topic": "JDBC extraction parallelism",
  "difficulty": "hard",
  "multi": false,
  "question": "An AWS Glue job reading a 900 GB table from Amazon RDS through JDBC runs for hours and the Spark UI shows a single task doing all the work. Which change parallelises the read?",
  "choices": {
   "A": "Configure the JDBC read with a numeric partition column, lower and upper bounds, and a number of partitions so Spark issues several range-bounded queries in parallel.",
   "B": "Increase the Glue job's worker count from 10 to 40 without other changes.",
   "C": "Enable job bookmarks on the JDBC source.",
   "D": "Add a read replica and point the job at the replica endpoint."
  },
  "answer": [
   "A"
  ],
  "explanation": "Without partitioning hints Spark issues one query on one connection, so exactly one task reads the table. Supplying a partition column with bounds and a partition count makes Spark generate several WHERE-bounded queries that run concurrently. More workers (option B) leaves the single task unchanged — the extra executors sit idle. Bookmarks (option C) make subsequent runs incremental but do not parallelise the initial extraction. A read replica (option D) protects the primary from load but the read is still serial."
 },
 {
  "id": "dea-51",
  "source": "authored",
  "domain": 1,
  "topic": "Spark data skew",
  "difficulty": "hard",
  "multi": false,
  "question": "A Spark job on Amazon EMR joins two large tables. Ninety-nine percent of tasks finish in under a minute while three tasks run for over an hour, and those tasks correspond to a handful of extremely common join keys. Which technique addresses the problem?",
  "choices": {
   "A": "Salt the skewed keys by appending a random suffix on the large side and replicating the matching rows on the small side, or enable adaptive query execution skew join handling.",
   "B": "Increase spark.sql.shuffle.partitions to 20,000 so the skewed keys are spread over more partitions.",
   "C": "Cache both tables in memory before the join.",
   "D": "Switch the join from an inner join to a left outer join."
  },
  "answer": [
   "A"
  ],
  "explanation": "All rows sharing a join key land in one partition, so a few hot keys create long-tail tasks no matter how the data is otherwise distributed. Salting splits a hot key into several synthetic keys and replicates the matching side, and Spark's adaptive query execution can split skewed partitions automatically. More shuffle partitions (option B) does not help, because a single key still cannot be split across partitions. Caching (option C) speeds repeated reads but the skewed shuffle is unchanged. Changing join type (option D) alters results, not distribution."
 },
 {
  "id": "dea-52",
  "source": "authored",
  "domain": 1,
  "topic": "Snowball for bulk migration",
  "difficulty": "easy",
  "multi": false,
  "question": "A research institute must move 600 TB from an on-premises array into Amazon S3. The site has a 100 Mbps internet link that is also used for daily operations, and the migration must complete within four weeks. Which approach is appropriate?",
  "choices": {
   "A": "Order multiple AWS Snowball Edge devices, copy the data locally and ship them to AWS.",
   "B": "Use AWS DataSync over the existing internet link with bandwidth throttling.",
   "C": "Use the S3 CLI with multipart upload and Transfer Acceleration.",
   "D": "Set up AWS Direct Connect and use S3 Replication."
  },
  "answer": [
   "A"
  ],
  "explanation": "At 100 Mbps and sharing the link with production traffic, 600 TB would take well over a year, so network transfer is out; Snowball Edge moves the data physically within the four-week window. DataSync (option B) and accelerated CLI uploads (option C) are still bounded by the same 100 Mbps pipe. Direct Connect (option D) has a lead time of weeks to months for provisioning and S3 Replication copies between S3 buckets, not from an on-premises array."
 },
 {
  "id": "dea-53",
  "source": "authored",
  "domain": 1,
  "topic": "Firehose delivery failures",
  "difficulty": "medium",
  "multi": false,
  "question": "An Amazon Data Firehose stream delivering to Amazon Redshift shows a rising DeliveryToRedshift.Failure metric during peak hours. The team must ensure no records are permanently lost while they investigate. What behaviour should they rely on and configure?",
  "choices": {
   "A": "Firehose retries for the configured retry duration and then writes the failed records to the configured S3 error prefix, so the team should confirm the error output location and backfill from it.",
   "B": "Firehose discards records that fail delivery, so the team should add a Lambda transformation that writes a copy to Amazon S3 first.",
   "C": "Firehose returns the records to the producer, so producers should implement their own dead-letter queue.",
   "D": "Firehose pauses the stream until delivery succeeds, so no configuration is required."
  },
  "answer": [
   "A"
  ],
  "explanation": "For Redshift and OpenSearch destinations Firehose retries for the configured duration and then delivers the records it could not write to the S3 bucket and error prefix configured on the stream, so nothing is lost and the team can reload from that prefix. Firehose does not silently discard records (option B), does not hand them back to the producer (option C) — PutRecord already returned success — and does not pause the stream (option D)."
 },
 {
  "id": "dea-54",
  "source": "authored",
  "domain": 1,
  "topic": "Athena partition projection",
  "difficulty": "hard",
  "multi": false,
  "question": "A table in Amazon S3 has more than 400,000 date-and-hour partitions. Queries spend a long time in the planning phase and the team must run MSCK REPAIR or a crawler after every load. Which change reduces both problems?",
  "choices": {
   "A": "Configure partition projection on the table, defining the partition key ranges and the S3 storage location template so Athena computes partitions instead of listing them.",
   "B": "Reduce partition granularity to monthly by rewriting the entire table.",
   "C": "Increase the Athena workgroup's query result retention period.",
   "D": "Enable the Glue Data Catalog's automatic partition indexing after every crawler run."
  },
  "answer": [
   "A"
  ],
  "explanation": "Partition projection makes Athena derive partition values from configured ranges and a location template, so query planning does not read hundreds of thousands of catalog partitions and no MSCK REPAIR or crawler is needed when new partitions appear. Rewriting to monthly partitions (option B) fixes planning cost by discarding useful pruning granularity and is a huge one-off job. Result retention (option C) affects stored query output. Partition indexes (option D) genuinely help catalog filtering, but they still require the partitions to be registered, so the crawler burden remains."
 },
 {
  "id": "dea-55",
  "source": "authored",
  "domain": 1,
  "topic": "Data validation on ingest",
  "difficulty": "medium",
  "multi": false,
  "question": "A pipeline must reject records that fail business rules — negative amounts, unknown currency codes — and quarantine them for review, while allowing valid records to continue. The team wants this expressed declaratively rather than as bespoke code. Which service feature fits?",
  "choices": {
   "A": "AWS Glue Data Quality rules on the job, routing rows that fail the ruleset to a quarantine location.",
   "B": "An Amazon Athena view with a WHERE clause that excludes invalid rows.",
   "C": "Amazon Macie custom data identifiers.",
   "D": "An AWS Config rule evaluating the S3 objects."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue Data Quality lets you declare rules in DQDL — column value ranges, allowed sets, completeness — evaluate them inside the job, and route failing rows to a separate output for review, which is the declarative quarantine pattern described. An Athena view (option B) hides bad rows at query time without quarantining or alerting on them. Macie (option C) discovers sensitive data such as PII, not business-rule violations. AWS Config (option D) evaluates resource configuration, not record content."
 },
 {
  "id": "dea-56",
  "source": "authored",
  "domain": 1,
  "topic": "Compression selection",
  "difficulty": "medium",
  "multi": false,
  "question": "A team writes large text-format log files to Amazon S3 that will be processed by Spark on Amazon EMR. Jobs currently under-utilise the cluster because each input object is read by exactly one task. Which compression choice fixes this?",
  "choices": {
   "A": "Use a splittable codec such as bzip2, or switch to a container format such as Parquet or ORC with Snappy so blocks can be read in parallel.",
   "B": "Use gzip with the highest compression level to reduce object size.",
   "C": "Disable compression entirely and rely on S3 request parallelism.",
   "D": "Use zip archives containing one file per hour."
  },
  "answer": [
   "A"
  ],
  "explanation": "Gzip streams cannot be split, so one task must decompress each object end to end — the cause of the idle cluster. Bzip2 is splittable, and Parquet or ORC with Snappy is better still because the container is block-organised and columnar. Higher gzip compression (option B) makes objects smaller but no more splittable. Turning compression off (option C) makes plain text splittable but multiplies storage and transfer cost. Zip archives (option D) are not splittable either and are awkward for Hadoop input formats."
 },
 {
  "id": "dea-57",
  "source": "authored",
  "domain": 1,
  "topic": "MSK Connect",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs Amazon MSK and wants to run an existing open-source Kafka Connect sink connector without provisioning connector infrastructure. Which option meets this requirement?",
  "choices": {
   "A": "Deploy the connector on Amazon MSK Connect, which runs Kafka Connect workers as a managed, auto-scaling service.",
   "B": "Package the connector as a Lambda layer and attach it to an MSK-triggered function.",
   "C": "Run the connector inside the MSK broker nodes using a custom configuration.",
   "D": "Convert the connector to a Glue streaming job by wrapping it in PySpark."
  },
  "answer": [
   "A"
  ],
  "explanation": "MSK Connect runs standard Kafka Connect connectors as a managed service with auto scaling, so an existing connector plugin can be uploaded and run without operating worker instances. Lambda layers (option B) cannot host the Kafka Connect runtime. MSK brokers (option C) are managed and do not accept arbitrary connector deployments. Rewriting a Java connector as PySpark (option D) discards the existing artifact, which was the whole point of the requirement."
 },
 {
  "id": "dea-58",
  "source": "authored",
  "domain": 1,
  "topic": "Ordering guarantees",
  "difficulty": "medium",
  "multi": false,
  "question": "An ingestion pipeline must guarantee that all events for a given account are processed in the order they were produced, while events for different accounts may be processed concurrently. Which design satisfies this?",
  "choices": {
   "A": "Publish to an SQS FIFO queue using account_id as the message group ID, so ordering is preserved per group and groups are processed in parallel.",
   "B": "Publish to an SQS standard queue and sort messages by timestamp in the consumer.",
   "C": "Publish to an SNS standard topic with one subscription per account.",
   "D": "Publish to an SQS FIFO queue using a UUID as the message group ID."
  },
  "answer": [
   "A"
  ],
  "explanation": "FIFO queues guarantee strict ordering within a message group and allow different groups to be consumed concurrently, so using account_id as the group ID gives per-account ordering with cross-account parallelism. A standard queue (option B) delivers out of order and consumer-side sorting cannot work without unbounded buffering. SNS standard topics (option C) provide no ordering, and one subscription per account does not scale. A UUID group ID (option D) puts every message in its own group, which destroys the per-account ordering guarantee."
 },
 {
  "id": "dea-59",
  "source": "authored",
  "domain": 1,
  "topic": "Glue auto scaling and DPU sizing",
  "difficulty": "medium",
  "multi": false,
  "question": "An AWS Glue Spark job's input volume varies from a few gigabytes to several hundred gigabytes between runs. The team currently sets a fixed 50 workers, which wastes capacity on small runs and is too small for large ones. What should they configure?",
  "choices": {
   "A": "Enable Glue auto scaling with a maximum worker count so the job adds and removes executors according to the workload of each run.",
   "B": "Split the job into two jobs, one sized for small inputs and one for large, and choose between them manually.",
   "C": "Increase the fixed worker count to 200 so the largest run always fits.",
   "D": "Set the job's execution class to Flex."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue auto scaling adjusts the number of executors during the run based on demand, up to the configured maximum, which handles a 100-fold swing in input size without manual tuning and bills only for capacity used. Two hand-picked job variants (option B) push a sizing decision onto an operator every run. A fixed 200 workers (option C) makes the waste on small runs far worse. Flex (option D) is a cost class for non-urgent jobs and does not size capacity to the input."
 },
 {
  "id": "dea-60",
  "source": "authored",
  "domain": 1,
  "topic": "API ingestion patterns",
  "difficulty": "medium",
  "multi": true,
  "question": "A partner will push JSON events to the company over HTTPS at a variable rate of up to 5,000 requests per second, with occasional bursts. The company must accept every event, buffer it, and process it asynchronously. Which TWO components form a suitable ingestion front end?",
  "choices": {
   "A": "Amazon API Gateway as the HTTPS entry point, with request validation and throttling.",
   "B": "An API Gateway direct integration with Amazon Kinesis Data Streams or Amazon SQS to buffer events before processing.",
   "C": "An API Gateway integration that writes synchronously to Amazon Redshift using the Data API.",
   "D": "Amazon CloudFront with a Lambda@Edge function that stores each request body in Amazon DynamoDB.",
   "E": "An Application Load Balancer with a Lambda target that processes each event synchronously and returns the processing result."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A managed HTTPS endpoint with validation and throttling, backed by a durable buffer, is the standard shape: API Gateway accepts and validates the request and its AWS service integration writes straight to Kinesis or SQS, decoupling ingest rate from processing rate with no code in the path. Writing synchronously to Redshift (option C) couples the partner's latency to warehouse load and will throttle. Lambda@Edge (option D) is intended for lightweight request manipulation, not high-rate durable ingestion. A synchronous Lambda behind an ALB (option E) removes the buffer entirely, so a processing slowdown becomes a partner-visible failure."
 },
 {
  "id": "dea-61",
  "source": "authored",
  "domain": 1,
  "topic": "Redshift MERGE and staging tables",
  "difficulty": "medium",
  "multi": false,
  "question": "A nightly load must apply inserts and updates from a staging table into a 4-billion-row fact table in Amazon Redshift. The current implementation runs a DELETE then an INSERT in separate transactions, and readers occasionally see rows missing. What should the team do?",
  "choices": {
   "A": "Use a single MERGE statement — or wrap the delete and insert in one explicit transaction — so the change becomes atomic for readers.",
   "B": "Run the DELETE and INSERT with a higher WLM priority so the window between them is shorter.",
   "C": "Enable concurrency scaling on the cluster.",
   "D": "Add a sort key on the join column so the DELETE completes instantly."
  },
  "answer": [
   "A"
  ],
  "explanation": "The missing rows are a transaction-boundary problem: between the committed DELETE and the committed INSERT, readers legitimately see a table without those rows. MERGE performs the upsert as one atomic statement, and wrapping both statements in a single transaction has the same effect. Higher priority (option B) shrinks the window without closing it. Concurrency scaling (option C) adds read capacity for queues, unrelated to atomicity. A sort key (option D) can speed the delete but the two-transaction gap remains."
 },
 {
  "id": "dea-62",
  "source": "authored",
  "domain": 1,
  "topic": "Late-arriving data and watermarks",
  "difficulty": "hard",
  "multi": false,
  "question": "A streaming aggregation computes per-minute totals from event timestamps. Some events arrive up to ten minutes late because of mobile connectivity, and those events are currently dropped. The team needs them included without keeping window state forever. What should they configure?",
  "choices": {
   "A": "Use event-time processing with a watermark that allows roughly ten minutes of lateness, so late events update their window before state is expired.",
   "B": "Switch the application from event time to processing time so no event is considered late.",
   "C": "Increase the window size from one minute to one hour.",
   "D": "Buffer all events for ten minutes in Amazon SQS before the streaming application reads them."
  },
  "answer": [
   "A"
  ],
  "explanation": "Watermarks are the mechanism for exactly this trade-off: the application keeps window state for the allowed lateness, folds in stragglers that arrive inside it, and only then discards the state, so memory stays bounded. Processing time (option B) stops calling events late by attributing them to the wrong minute, corrupting the aggregate. Hour-long windows (option C) hide the problem at the cost of the required per-minute granularity. Delaying everything by ten minutes (option D) penalises all events to accommodate a few and still drops anything later."
 },
 {
  "id": "dea-63",
  "source": "authored",
  "domain": 1,
  "topic": "Firehose to OpenSearch",
  "difficulty": "easy",
  "multi": false,
  "question": "An operations team needs application logs searchable in Amazon OpenSearch Service within about a minute of being produced, with a durable copy of every log line retained in Amazon S3 for compliance. Which design meets both needs with the least code?",
  "choices": {
   "A": "Send logs to an Amazon Data Firehose stream with OpenSearch Service as the destination and source record backup to Amazon S3 enabled.",
   "B": "Write logs to Amazon S3 and run an hourly Lambda function that bulk-indexes new objects into OpenSearch.",
   "C": "Write logs directly to OpenSearch from the application and snapshot the domain to S3 nightly.",
   "D": "Send logs to Amazon SQS and have a consumer fan out to both OpenSearch and S3."
  },
  "answer": [
   "A"
  ],
  "explanation": "Firehose delivers to OpenSearch with buffering measured in seconds and can simultaneously back up every source record to S3, satisfying both the latency and the retention requirement with configuration only. Hourly bulk indexing (option B) misses the one-minute target by a wide margin. Direct writes plus nightly snapshots (option C) makes the application responsible for retries and backpressure, and a domain snapshot is a recovery artifact rather than a log archive. A custom SQS consumer fanning out (option D) is code the team would have to write and operate."
 },
 {
  "id": "dea-64",
  "source": "authored",
  "domain": 1,
  "topic": "Athena UDF and custom logic",
  "difficulty": "medium",
  "multi": false,
  "question": "An analytics query in Amazon Athena must decrypt a tokenised column using a proprietary algorithm that already exists as a Java library. The team wants to call it from SQL. Which capability supports this?",
  "choices": {
   "A": "An Athena user defined function implemented as an AWS Lambda function, invoked with the USING EXTERNAL FUNCTION clause.",
   "B": "An AWS Glue custom classifier that decrypts values during crawling.",
   "C": "An Amazon Redshift Python UDF referenced from Athena.",
   "D": "A CREATE FUNCTION statement in Athena that loads the JAR from Amazon S3 into the query engine."
  },
  "answer": [
   "A"
  ],
  "explanation": "Athena supports UDFs implemented as Lambda functions written with the Athena Query Federation SDK, invoked from SQL through USING EXTERNAL FUNCTION — the supported way to run custom Java logic inside a query. Glue classifiers (option B) determine how a crawler parses a file format and cannot transform values. A Redshift UDF (option C) lives inside Redshift and is not callable from Athena. Athena does not load user JARs into its own engine through CREATE FUNCTION (option D)."
 },
 {
  "id": "dea-65",
  "source": "authored",
  "domain": 1,
  "topic": "S3 Batch Operations",
  "difficulty": "medium",
  "multi": false,
  "question": "A compliance change requires re-encrypting 80 million existing objects in an Amazon S3 bucket with a new AWS KMS key and recording the result of each object. The team wants a managed job with progress tracking and a completion report rather than a custom script. Which service should they use?",
  "choices": {
   "A": "S3 Batch Operations, driven by an S3 Inventory manifest, running a copy operation with the new encryption settings and writing a completion report.",
   "B": "An AWS Glue job that lists the bucket and rewrites each object.",
   "C": "S3 Lifecycle configuration with a transition rule that re-encrypts objects.",
   "D": "S3 Replication to a new bucket configured with the new KMS key."
  },
  "answer": [
   "A"
  ],
  "explanation": "S3 Batch Operations is the managed bulk-operation service: it takes an S3 Inventory report as its manifest, applies an operation such as copy with new encryption settings to every listed object, retries failures, tracks progress and emits a per-object completion report. A Glue job (option B) would reimplement all of that. Lifecycle rules (option C) transition storage class or expire objects and cannot change encryption. Replication (option D) can re-encrypt on the target but by default applies to new objects, needs batch replication for existing ones, and leaves the data in a different bucket."
 },
 {
  "id": "dea-66",
  "source": "authored",
  "domain": 1,
  "topic": "Timestamp and time zone handling",
  "difficulty": "medium",
  "multi": false,
  "question": "Events arrive from applications in several countries, each writing local timestamps without offsets. Daily aggregates computed in the lake do not reconcile with the source systems around daylight-saving transitions. What is the most robust fix?",
  "choices": {
   "A": "Require producers to emit timestamps in UTC with an explicit offset or time zone identifier, store the UTC instant, and convert to local time only at reporting time.",
   "B": "Convert every timestamp to the data lake account's Region time zone during ingestion.",
   "C": "Store timestamps as strings exactly as received and let each consumer interpret them.",
   "D": "Partition the table by the producing country so each partition can be interpreted separately."
  },
  "answer": [
   "A"
  ],
  "explanation": "An ambiguous local timestamp cannot be repaired downstream: during a daylight-saving fall-back the same wall-clock hour occurs twice. Carrying an explicit offset or zone identifier and storing the UTC instant makes every value unambiguous, with localisation deferred to presentation. Converting to a single Region time zone (option B) inherits daylight-saving ambiguity of its own. Raw strings (option C) push an unsolvable problem onto every consumer. Country partitions (option D) narrow the guesswork but still leave the repeated hour ambiguous."
 },
 {
  "id": "dea-67",
  "source": "authored",
  "domain": 1,
  "topic": "Deduplication in batch",
  "difficulty": "medium",
  "multi": false,
  "question": "A daily batch file sometimes contains the same transaction more than once, with the later copy holding corrected values. The load must keep only the most recent version of each transaction ID. Which SQL approach is most appropriate?",
  "choices": {
   "A": "Use ROW_NUMBER() partitioned by transaction ID and ordered by the record's update timestamp descending, keeping only the rows where the row number equals 1.",
   "B": "Use SELECT DISTINCT over all columns.",
   "C": "Use GROUP BY transaction ID with MAX() applied to every other column.",
   "D": "Use a LEFT JOIN of the file to itself on transaction ID and discard rows that match."
  },
  "answer": [
   "A"
  ],
  "explanation": "A windowed ROW_NUMBER over the transaction ID, ordered by update time, ranks the versions and keeps the newest complete row — the standard deduplication idiom and the only option that preserves the corrected record as a coherent row. DISTINCT (option B) removes only byte-identical duplicates, so a corrected copy survives alongside the original. Per-column MAX (option C) can assemble a Frankenstein row from different versions. A self-join discarding matches (option D) drops both copies of every duplicated transaction."
 },
 {
  "id": "dea-68",
  "source": "authored",
  "domain": 1,
  "topic": "EventBridge Scheduler",
  "difficulty": "easy",
  "multi": false,
  "question": "A team needs to start 300 different AWS Glue jobs at various times of day, each with its own schedule and payload, without creating one EventBridge rule per job on a shared bus. Which service is designed for this?",
  "choices": {
   "A": "Amazon EventBridge Scheduler, which supports large numbers of individually configured one-time and recurring schedules with per-schedule targets and payloads.",
   "B": "Amazon EventBridge event bus rules with a cron expression on each rule.",
   "C": "AWS Step Functions Wait states chained together.",
   "D": "Amazon CloudWatch alarms configured with a scheduled action."
  },
  "answer": [
   "A"
  ],
  "explanation": "EventBridge Scheduler is the purpose-built scheduling service: it scales to very large numbers of schedules, each with its own cron or rate expression, target and input payload, plus retry and dead-letter configuration. Rules on an event bus (option B) work but are subject to rules-per-bus limits and are a clumsier fit at this scale. Chained Wait states (option C) would require a running execution per job forever. CloudWatch alarms (option D) react to metric thresholds and have no scheduling capability."
 },
 {
  "id": "dea-69",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift distribution styles",
  "difficulty": "hard",
  "multi": false,
  "question": "In Amazon Redshift, a 3-billion-row fact table is joined constantly to a 900-million-row dimension on customer_id, and query plans show large DS_BCAST_INNER and DS_DIST_BOTH steps. Which table design change most reduces the data redistribution?",
  "choices": {
   "A": "Set DISTSTYLE KEY with DISTKEY(customer_id) on both tables so matching rows are colocated on the same slice.",
   "B": "Set DISTSTYLE ALL on both tables so every node has a full copy.",
   "C": "Set DISTSTYLE EVEN on both tables so rows spread uniformly across slices.",
   "D": "Set DISTSTYLE AUTO on the fact table and DISTSTYLE ALL on the dimension table."
  },
  "answer": [
   "A"
  ],
  "explanation": "Distributing both tables on the join column colocates matching rows on the same slice, so the join happens locally and the broadcast and redistribution steps disappear. DISTSTYLE ALL (option B) replicates a table to every node and is appropriate only for small dimensions — a 900-million-row copy per node is impractical, which also rules out option D. EVEN distribution (option C) spreads rows without regard to the join key, which is what forces redistribution in the first place."
 },
 {
  "id": "dea-70",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift sort keys",
  "difficulty": "medium",
  "multi": false,
  "question": "Analysts almost always filter an Amazon Redshift fact table by a date range covering the last few days. Queries currently scan the whole table. Which change most improves scan pruning?",
  "choices": {
   "A": "Define the event date column as the sort key so zone maps let Redshift skip blocks outside the requested range.",
   "B": "Define the event date column as the distribution key so date-filtered queries touch fewer slices.",
   "C": "Create a secondary index on the event date column.",
   "D": "Increase the number of nodes so each node scans less data."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift stores per-block minimum and maximum values, so sorting on the filtered column lets the engine skip blocks whose range cannot match — the pruning mechanism the workload needs. Making date the distribution key (option B) would concentrate each day's rows on one slice, creating severe skew on exactly the days being queried. Redshift has no secondary indexes (option C). Adding nodes (option D) spreads the same full scan wider at higher cost."
 },
 {
  "id": "dea-71",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB partition key design",
  "difficulty": "hard",
  "multi": false,
  "question": "A DynamoDB table storing IoT readings uses device_type as the partition key and timestamp as the sort key. Three device types account for most traffic and those partitions throttle while overall provisioned capacity is barely used. Which redesign fixes the hot partition problem?",
  "choices": {
   "A": "Use device_id as the partition key, or a composite key such as device_id plus a time bucket, so writes spread across many partitions.",
   "B": "Increase provisioned write capacity units on the table until the hot partitions stop throttling.",
   "C": "Add a local secondary index on timestamp.",
   "D": "Enable DynamoDB Accelerator (DAX) in front of the table."
  },
  "answer": [
   "A"
  ],
  "explanation": "Throttling with spare table capacity is the signature of low-cardinality partition keys: all traffic for a device type maps to one partition and hits its per-partition limit. Keying on device_id — optionally combined with a time bucket to bound item collection size — spreads traffic across the key space. Raising provisioned capacity (option B) does not lift the per-partition ceiling and wastes money. An LSI (option C) shares the same partition key and therefore the same hot partition. DAX (option D) caches reads and does nothing for write throttling."
 },
 {
  "id": "dea-72",
  "source": "authored",
  "domain": 2,
  "topic": "S3 lifecycle and storage classes",
  "difficulty": "medium",
  "multi": false,
  "question": "Raw data lands in Amazon S3 and is queried heavily for 30 days, occasionally for the next 11 months, and after that must be retained for six more years for audits with retrieval times of up to 12 hours acceptable. Which lifecycle configuration is most cost effective?",
  "choices": {
   "A": "Store in S3 Standard, transition to S3 Standard-IA at 30 days, transition to S3 Glacier Deep Archive at 365 days, and expire at seven years.",
   "B": "Store in S3 Standard for the full seven years and rely on request-level caching.",
   "C": "Store in S3 One Zone-IA from day zero and transition to S3 Glacier Instant Retrieval at 365 days.",
   "D": "Store in S3 Intelligent-Tiering and disable the archive access tiers."
  },
  "answer": [
   "A"
  ],
  "explanation": "The access pattern maps directly onto the tiers: Standard for the hot 30 days, Standard-IA for infrequent access over the next 11 months, and Deep Archive for the six-year audit tail where a 12-hour retrieval is acceptable and storage cost is lowest, with an expiry rule at seven years. Staying in Standard (option B) pays hot-tier prices for years of cold data. One Zone-IA from day zero (option C) puts hot, single-AZ-durability data in the wrong tier and Glacier Instant Retrieval costs far more than Deep Archive for the audit tail. Intelligent-Tiering without archive tiers (option D) never reaches the cheapest tiers, so the six-year tail stays expensive."
 },
 {
  "id": "dea-73",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift RA3 and managed storage",
  "difficulty": "medium",
  "multi": false,
  "question": "A Redshift DC2 cluster is running out of disk while CPU utilisation stays below 25 percent. The team must add storage without paying for compute it does not need. What should they do?",
  "choices": {
   "A": "Resize the cluster to RA3 nodes, which separate compute from Redshift Managed Storage so storage scales independently of node count.",
   "B": "Add more DC2 nodes until there is enough disk.",
   "C": "Enable concurrency scaling so queries spill to additional clusters.",
   "D": "Enable automatic table optimization on the largest tables."
  },
  "answer": [
   "A"
  ],
  "explanation": "DC2 nodes couple storage to compute, so the only way to add disk is to add nodes and pay for unused CPU. RA3 nodes use Redshift Managed Storage, where data scales into S3-backed storage independently and you size nodes for compute alone. More DC2 nodes (option B) is the expensive path the requirement rules out. Concurrency scaling (option C) adds transient query capacity, not storage. Automatic table optimization (option D) can reclaim some space through better encoding and sorting but does not solve a structural capacity shortfall."
 },
 {
  "id": "dea-74",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift data sharing",
  "difficulty": "medium",
  "multi": false,
  "question": "A central Redshift cluster holds curated data that three other teams, each with their own Redshift cluster in a different AWS account, need to query live. The company wants no data copies and no ETL between clusters. Which feature should they use?",
  "choices": {
   "A": "Amazon Redshift data sharing, creating a datashare on the producer and granting it to each consumer cluster's namespace or account.",
   "B": "Nightly UNLOAD to Amazon S3 followed by COPY into each consumer cluster.",
   "C": "Cross-region snapshot copies restored into each consumer account.",
   "D": "Redshift Spectrum external tables pointing at the producer cluster's local storage."
  },
  "answer": [
   "A"
  ],
  "explanation": "Data sharing exposes producer schemas, tables and views to consumer clusters — including across accounts, with AWS RAM for the account grant — so consumers read live data with no copying and no ETL. UNLOAD plus COPY (option B) creates three stale copies and the pipeline the company wants to avoid. Snapshot restores (option C) create full independent clusters frozen at a point in time. Spectrum (option D) reads S3 data through an external catalog; it cannot address another cluster's local storage."
 },
 {
  "id": "dea-75",
  "source": "authored",
  "domain": 2,
  "topic": "Iceberg table maintenance",
  "difficulty": "hard",
  "multi": true,
  "question": "An Apache Iceberg table in the data lake receives frequent small MERGE operations. Query performance has degraded and storage cost is rising even though logical row count is flat. Which TWO maintenance operations address this?",
  "choices": {
   "A": "Run periodic compaction to rewrite many small data files into fewer larger ones.",
   "B": "Expire old snapshots and remove orphan files so obsolete data files stop accumulating.",
   "C": "Rerun the Glue crawler over the table's S3 prefix after every MERGE.",
   "D": "Convert the table from Iceberg to plain Parquet with Hive-style partitions.",
   "E": "Increase the Athena workgroup's data scanned limit."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Frequent row-level MERGE operations leave behind many small files and a long chain of snapshots whose superseded data files still occupy storage. Compaction restores healthy file sizes, and expiring snapshots plus removing orphan files reclaims the space — the two standard Iceberg maintenance tasks. A crawler (option C) is unnecessary because Iceberg metadata already tracks files and can even confuse the table definition. Abandoning Iceberg (option D) gives up the transactional features that made MERGE possible. Raising a scan limit (option E) removes a guardrail without improving anything."
 },
 {
  "id": "dea-76",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB TTL",
  "difficulty": "easy",
  "multi": false,
  "question": "A DynamoDB table stores session records that are worthless after 30 days. Storage cost is growing and a nightly scan-and-delete job consumes significant write capacity. What is the most efficient way to remove expired items?",
  "choices": {
   "A": "Enable time to live on the table with an attribute holding the expiry epoch time, so DynamoDB deletes expired items automatically at no additional write cost.",
   "B": "Run the scan-and-delete job during off-peak hours with a lower rate limit.",
   "C": "Create a global secondary index on the expiry timestamp and delete through the index.",
   "D": "Switch the table to on-demand capacity so deletes no longer consume provisioned capacity."
  },
  "answer": [
   "A"
  ],
  "explanation": "TTL is the built-in mechanism: DynamoDB removes items whose TTL attribute has passed, in the background, without consuming write capacity, and can emit the deletes to DynamoDB Streams if downstream systems care. Rescheduling the scan job (option B) keeps paying for both the scan and the deletes. A GSI (option C) makes finding expired items cheaper but the deletes still cost write capacity, on the table and the index. On-demand mode (option D) changes the billing model, so the deletes are still paid for per request."
 },
 {
  "id": "dea-77",
  "source": "authored",
  "domain": 2,
  "topic": "Glue Data Catalog as Hive metastore",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs Spark on Amazon EMR, Amazon Athena and Amazon Redshift Spectrum, and each currently keeps its own table definitions. The team wants one shared technical catalog so a table defined once is visible to all three. What should they do?",
  "choices": {
   "A": "Use the AWS Glue Data Catalog as the metastore for all three engines — configured as the Hive metastore for EMR, natively by Athena, and through an external schema in Redshift Spectrum.",
   "B": "Run a self-managed Hive metastore on Amazon RDS and point Athena at it directly.",
   "C": "Store the DDL scripts in a Git repository and apply them to each engine in a nightly job.",
   "D": "Use Amazon DataZone as the metastore for all three engines."
  },
  "answer": [
   "A"
  ],
  "explanation": "The Glue Data Catalog is the shared, Hive-compatible metastore across the AWS analytics stack: EMR can be configured to use it in place of a local Hive metastore, Athena uses it natively, and Redshift Spectrum reads it through an external schema. A self-managed metastore on RDS (option B) is an operational burden and Athena expects the Glue catalog. Replaying DDL everywhere (option C) keeps three catalogs that drift between runs. DataZone (option D) is a business data catalog and governance layer built on top of technical catalogs, not a metastore engines query."
 },
 {
  "id": "dea-78",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift Serverless",
  "difficulty": "medium",
  "multi": false,
  "question": "A department runs analytical queries for about three hours on weekday mornings and nothing at other times. They want warehouse capability without paying for idle capacity or managing cluster sizing. Which option fits best?",
  "choices": {
   "A": "Amazon Redshift Serverless, which bills for capacity used while queries run and scales automatically with workload.",
   "B": "A provisioned RA3 cluster with a pause and resume schedule.",
   "C": "A provisioned DC2 cluster with concurrency scaling enabled.",
   "D": "Amazon Athena with the data left in Amazon S3 and no warehouse at all."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift Serverless removes both the sizing decision and the idle cost: capacity is measured in RPUs consumed while queries run, and it scales up and down automatically. Pause and resume on a provisioned cluster (option B) helps but still requires choosing a node type and count and managing the schedule, and storage is billed while paused. A DC2 cluster with concurrency scaling (option C) pays for nodes around the clock. Athena (option D) is a reasonable alternative architecture but abandons the warehouse the department asked for, including its workload management and local storage performance."
 },
 {
  "id": "dea-79",
  "source": "authored",
  "domain": 2,
  "topic": "S3 versioning and accidental deletion",
  "difficulty": "medium",
  "multi": false,
  "question": "A data lake bucket must survive an operator accidentally deleting objects, and the recovery must not depend on the operator's own credentials being uncompromised. Which combination provides the strongest protection?",
  "choices": {
   "A": "Enable S3 Versioning together with MFA delete or an S3 Object Lock retention policy, and restrict the delete permissions in the bucket policy.",
   "B": "Enable S3 Versioning alone and rely on restoring previous versions when needed.",
   "C": "Enable S3 Replication to a bucket in the same account and Region.",
   "D": "Enable S3 Storage Lens and alert on a drop in object count."
  },
  "answer": [
   "A"
  ],
  "explanation": "Versioning preserves previous versions when an object is deleted or overwritten, but a caller with sufficient permissions can still permanently delete versions — so pairing it with MFA delete or Object Lock retention, plus a restrictive bucket policy, means recovery does not hinge on that operator's credentials. Versioning alone (option B) leaves that gap. Same-account, same-Region replication (option C) can propagate the problem and shares the account's blast radius. Storage Lens alerting (option D) tells you about the loss after it happens."
 },
 {
  "id": "dea-80",
  "source": "authored",
  "domain": 2,
  "topic": "Choosing a purpose-built database",
  "difficulty": "medium",
  "multi": false,
  "question": "An application must store billions of time-stamped metric points, query recent windows with sub-second latency, and automatically move older data to cheaper storage while keeping it queryable through the same interface. Which AWS service fits best?",
  "choices": {
   "A": "Amazon Timestream, which is purpose built for time series data with tiered memory and magnetic storage.",
   "B": "Amazon Neptune, using a time-stamped property on each vertex.",
   "C": "Amazon DocumentDB, with one document per metric point.",
   "D": "Amazon Redshift, with a fact table sorted by timestamp."
  },
  "answer": [
   "A"
  ],
  "explanation": "Timestream is the purpose-built time series database: it keeps recent data in a fast memory store for low-latency window queries and ages it into cheaper magnetic storage automatically, with both tiers queryable through one SQL interface. Neptune (option B) is a graph database for relationship traversal. DocumentDB (option C) is a document store with no time series tiering and would be costly at billions of points. Redshift (option D) can hold the data but is a batch-oriented warehouse without automatic hot-to-cold tiering or sub-second point queries."
 },
 {
  "id": "dea-81",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift materialized views",
  "difficulty": "medium",
  "multi": false,
  "question": "A dashboard runs the same expensive aggregation over an Amazon Redshift fact table every few minutes, and the underlying table changes slowly. The team wants the dashboard to be fast without rewriting its SQL. Which feature helps most?",
  "choices": {
   "A": "Create a materialized view for the aggregation with automatic refresh, and rely on automatic query rewriting to serve the existing dashboard SQL from it.",
   "B": "Create a standard view over the aggregation so Redshift caches the result.",
   "C": "Increase the WLM memory allocation for the dashboard queue.",
   "D": "Enable concurrency scaling so the dashboard query runs on a separate cluster."
  },
  "answer": [
   "A"
  ],
  "explanation": "A materialized view stores the precomputed aggregate and can refresh automatically, and Redshift's automatic rewriting can transparently redirect an equivalent query to it — so the dashboard's existing SQL runs against precomputed results. A standard view (option B) is just stored SQL and re-executes the aggregation every time. More WLM memory (option C) may avoid spill but still recomputes the aggregate. Concurrency scaling (option D) adds capacity for queued queries without making any individual query cheaper."
 },
 {
  "id": "dea-82",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift VACUUM and ANALYZE",
  "difficulty": "medium",
  "multi": false,
  "question": "After months of heavy DELETE and INSERT activity, Redshift queries on a large table have slowed and SVV_TABLE_INFO shows high unsorted and stats_off percentages. Which maintenance actions address this?",
  "choices": {
   "A": "Run VACUUM to reclaim space and re-sort rows, and ANALYZE to refresh the statistics the planner uses.",
   "B": "Run TRUNCATE on the table and reload it from the source every night.",
   "C": "Rebuild the cluster from a snapshot to defragment storage.",
   "D": "Increase the number of query slots in the default WLM queue."
  },
  "answer": [
   "A"
  ],
  "explanation": "High unsorted percentage means new rows sit outside the sort order, defeating zone-map pruning, and stale statistics mean the planner mis-estimates row counts — VACUUM and ANALYZE are precisely the remedies, and Redshift can also run them automatically. Nightly truncate and reload (option B) is a heavy workaround that discards the incremental design. Restoring from a snapshot (option C) recreates the same unsorted state. More WLM slots (option D) changes concurrency, not physical layout or statistics."
 },
 {
  "id": "dea-83",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift WLM and short queries",
  "difficulty": "hard",
  "multi": false,
  "question": "On a shared Amazon Redshift cluster, quick dashboard queries frequently wait behind long-running nightly ETL statements. The team wants short queries to keep responding quickly with minimal manual tuning. What should they configure?",
  "choices": {
   "A": "Use automatic WLM with query priorities, placing dashboard queries in a high-priority queue via query group or user group matching, and enable short query acceleration.",
   "B": "Set manual WLM with a single queue and 50 concurrency slots.",
   "C": "Move the ETL statements to a second cluster restored from the latest snapshot.",
   "D": "Increase the cluster's node count so the ETL finishes sooner."
  },
  "answer": [
   "A"
  ],
  "explanation": "Automatic WLM manages memory and concurrency dynamically and honours per-queue priorities, so high-priority dashboard queries are admitted ahead of bulk ETL, and short query acceleration routes brief queries to a dedicated fast lane. A single 50-slot manual queue (option B) fragments memory so badly that large queries spill and everything slows. A second cluster from a snapshot (option C) creates a stale copy and a whole extra system. More nodes (option D) shortens the ETL but leaves the queuing behaviour unchanged."
 },
 {
  "id": "dea-84",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift Spectrum external tables",
  "difficulty": "medium",
  "multi": false,
  "question": "A company keeps five years of history in Amazon S3 and the last 90 days in Amazon Redshift. Analysts must run single queries that span both. What is the appropriate configuration?",
  "choices": {
   "A": "Create an external schema in Redshift referencing the AWS Glue Data Catalog and query the S3 history through Redshift Spectrum, joined with the local tables.",
   "B": "COPY all five years of history into the Redshift cluster and drop the S3 copy.",
   "C": "Create an Athena view over both the S3 data and the Redshift tables.",
   "D": "Use a federated query from Redshift to Amazon RDS to reach the S3 history."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift Spectrum is designed for this hot-and-cold split: an external schema backed by the Glue Data Catalog exposes the S3 history as external tables that can be joined to local tables in one SQL statement, with the scan pushed down to the Spectrum layer. Loading five years into the cluster (option B) discards the cost advantage of keeping cold data in S3. Athena (option C) cannot read Redshift's local tables. Federated query (option D) reaches relational engines such as PostgreSQL and MySQL, not S3."
 },
 {
  "id": "dea-85",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift snapshots and DR",
  "difficulty": "medium",
  "multi": false,
  "question": "A Redshift cluster must be recoverable in a second AWS Region within a few hours of a Regional failure, with a recovery point of no more than one day. The team wants the least ongoing effort. What should they configure?",
  "choices": {
   "A": "Enable automated snapshots with cross-Region snapshot copy to the DR Region, and restore a cluster from the copied snapshot if the primary Region fails.",
   "B": "Run a second identical cluster in the DR Region and keep it in sync with hourly UNLOAD and COPY jobs.",
   "C": "Rely on Redshift's built-in Multi-AZ deployment, which automatically fails over across Regions.",
   "D": "Take manual snapshots weekly and store them in the primary Region."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cross-Region snapshot copy is configuration, not a pipeline: automated snapshots are replicated to the DR Region on their own schedule, and a restore there meets a multi-hour recovery time with a recovery point well inside one day. A warm standby fed by UNLOAD and COPY (option B) doubles cost and is a pipeline to operate. Redshift Multi-AZ (option C) protects against an Availability Zone failure within one Region, not a Regional one. Weekly snapshots kept in the failed Region (option D) fail both the recovery point objective and the location requirement."
 },
 {
  "id": "dea-86",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB secondary indexes",
  "difficulty": "hard",
  "multi": false,
  "question": "An orders table in DynamoDB has order_id as the partition key. A new requirement is to list all orders for a customer sorted by order date, for a customer set that changes constantly. Which design supports this access pattern?",
  "choices": {
   "A": "Create a global secondary index with customer_id as the partition key and order_date as the sort key.",
   "B": "Create a local secondary index with customer_id as the sort key.",
   "C": "Scan the table with a filter expression on customer_id and sort the results in the application.",
   "D": "Add customer_id to the existing partition key as a composite string."
  },
  "answer": [
   "A"
  ],
  "explanation": "A GSI can define a completely different partition and sort key, so customer_id plus order_date gives an efficient, already-sorted query for any customer. An LSI (option B) must keep the table's partition key — order_id — so it cannot answer a per-customer query. Scan with a filter (option C) reads the whole table for every request and does not scale. Folding customer_id into the table's partition key (option D) would break every existing lookup by order_id."
 },
 {
  "id": "dea-87",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB capacity modes",
  "difficulty": "medium",
  "multi": false,
  "question": "A new application's DynamoDB traffic is completely unpredictable, with idle periods and sudden ten-fold spikes. The team cannot forecast capacity and wants to avoid throttling during spikes. Which configuration is most appropriate at launch?",
  "choices": {
   "A": "On-demand capacity mode, which serves traffic without capacity planning and scales with the workload.",
   "B": "Provisioned capacity with auto scaling set to a target utilisation of 70 percent.",
   "C": "Provisioned capacity sized for the peak observed during load testing.",
   "D": "Provisioned capacity with reserved capacity purchased for one year."
  },
  "answer": [
   "A"
  ],
  "explanation": "On-demand mode requires no forecasting and absorbs sudden spikes, which is exactly the situation at launch when the traffic shape is unknown. Provisioned with auto scaling (option B) reacts on a metric-driven delay of minutes, so a ten-fold spike throttles before scaling catches up. Provisioning for peak (option C) pays for peak capacity during idle periods. Reserved capacity (option D) commits money for a year to a workload nobody can size yet."
 },
 {
  "id": "dea-88",
  "source": "authored",
  "domain": 2,
  "topic": "OpenSearch storage tiers",
  "difficulty": "medium",
  "multi": false,
  "question": "An Amazon OpenSearch Service domain holds 90 days of logs. The last 7 days are searched constantly, days 8 to 30 occasionally, and days 31 to 90 rarely but must remain searchable. Which configuration minimises cost?",
  "choices": {
   "A": "Keep recent indexes on hot nodes, move older indexes to UltraWarm, and move the oldest to cold storage, automating the moves with Index State Management policies.",
   "B": "Keep all 90 days on hot nodes and add more data nodes to hold the volume.",
   "C": "Delete indexes after 7 days and reindex from Amazon S3 when older data is needed.",
   "D": "Store all indexes on hot nodes but reduce the replica count to zero for older indexes."
  },
  "answer": [
   "A"
  ],
  "explanation": "OpenSearch's tiering matches the access pattern directly: hot nodes for the searched-constantly window, UltraWarm for the occasional range and cold storage for the rare tail, with Index State Management rolling indexes between tiers automatically. Adding hot nodes (option B) is the most expensive option. Deleting and reindexing on demand (option C) breaks the requirement that older data stay searchable. Dropping replicas (option D) trims cost slightly while sacrificing availability and read throughput, and still pays hot-tier storage for 90 days."
 },
 {
  "id": "dea-89",
  "source": "authored",
  "domain": 2,
  "topic": "Partitioning strategy",
  "difficulty": "hard",
  "multi": false,
  "question": "A data lake table is partitioned by year, month, day, hour and customer_id. There are 20,000 customers, and most queries filter on a date range only. Athena performance is poor and the catalog holds tens of millions of partitions. What should the team change?",
  "choices": {
   "A": "Reduce partition cardinality — partition by date only, keep customer_id as a regular column, and rely on columnar statistics or sorting within files for customer filtering.",
   "B": "Add a further partition level for order status to spread data more evenly.",
   "C": "Convert the table to CSV so partition metadata is smaller.",
   "D": "Increase the Glue Data Catalog partition limit through a service quota increase."
  },
  "answer": [
   "A"
  ],
  "explanation": "Over-partitioning is the problem: hourly partitions multiplied by 20,000 customers produce millions of tiny partitions, so planning cost and small-file overhead dominate and the customer dimension buys nothing for date-filtered queries. Partitioning by date and keeping customer_id as a sorted column preserves pruning where it matters. Another partition level (option B) multiplies the count again. CSV (option C) makes every scan worse and does not change partition count. Raising a quota (option D) accommodates a bad layout rather than fixing it."
 },
 {
  "id": "dea-90",
  "source": "authored",
  "domain": 2,
  "topic": "Aurora Serverless v2",
  "difficulty": "medium",
  "multi": false,
  "question": "A reporting database built on Amazon Aurora PostgreSQL is idle overnight and heavily used for four hours each morning. The team wants capacity to track demand in fine increments without connection interruptions during scaling. Which option should they choose?",
  "choices": {
   "A": "Aurora Serverless v2, which scales capacity in fine-grained ACU increments in place while the database stays available.",
   "B": "A provisioned Aurora instance sized for the morning peak, running continuously.",
   "C": "A provisioned Aurora instance stopped each night and started each morning by a Lambda function.",
   "D": "Aurora with read replicas added and removed on a schedule."
  },
  "answer": [
   "A"
  ],
  "explanation": "Serverless v2 adjusts capacity in small increments, in place and without dropping connections, so a workload that swings from idle to a four-hour peak pays close to what it uses. A permanently provisioned peak-sized instance (option B) pays for twenty idle hours a day. Stop and start automation (option C) has a hard seven-day stop limit, means downtime during transitions and still gives one fixed size while running. Scheduled read replicas (option D) add read capacity in coarse steps and leave the writer sized for peak."
 },
 {
  "id": "dea-91",
  "source": "authored",
  "domain": 2,
  "topic": "S3 request throughput and key design",
  "difficulty": "hard",
  "multi": false,
  "question": "A Spark job reading millions of objects from one Amazon S3 prefix receives frequent 503 Slow Down responses. The team must raise the achievable request rate. Which action is most effective?",
  "choices": {
   "A": "Spread the objects across many prefixes, since S3 scales request capacity per prefix, and use retries with exponential backoff.",
   "B": "Enable S3 Transfer Acceleration on the bucket.",
   "C": "Enable S3 Versioning so older versions absorb some of the request load.",
   "D": "Move the bucket to a Region closer to the EMR cluster."
  },
  "answer": [
   "A"
  ],
  "explanation": "S3 supports a high request rate per partitioned prefix, so concentrating millions of objects under one prefix caps throughput and produces 503 Slow Down; distributing keys across many prefixes multiplies the available rate, and backoff smooths the transient case while S3 repartitions. Transfer Acceleration (option B) optimises long-distance internet transfers through edge locations, not in-Region request rate. Versioning (option C) is irrelevant to request scaling. Region proximity (option D) reduces latency but the per-prefix rate limit is unchanged."
 },
 {
  "id": "dea-92",
  "source": "authored",
  "domain": 2,
  "topic": "Schema evolution in the data lake",
  "difficulty": "hard",
  "multi": false,
  "question": "A producer adds a new optional column to Parquet files written into an existing partitioned table. Existing partitions do not contain the column, and Athena queries now fail with a schema mismatch on older partitions. What is the most robust remedy?",
  "choices": {
   "A": "Add the column to the table definition and make sure partitions inherit the table schema, or move to a table format such as Iceberg that tracks schema evolution by field ID.",
   "B": "Rewrite every historical partition to include the new column with null values, and repeat this for every future schema change.",
   "C": "Create a separate table for data written after the change and ask analysts to union the two tables.",
   "D": "Drop and recreate the table after each producer change so the crawler infers the newest schema."
  },
  "answer": [
   "A"
  ],
  "explanation": "Partitions in a Hive-style catalog carry their own schema, so the table-level change must be propagated — either by updating the table and having partitions inherit it, or by adopting Iceberg, whose field-ID-based schema evolution makes added, renamed and dropped columns safe by design. Rewriting all history (option B) works once but is an unbounded cost repeated on every change. Two tables and a union (option C) pushes the problem to every query. Dropping and recreating (option D) loses table properties and does nothing for the older partitions' stored schemas."
 },
 {
  "id": "dea-93",
  "source": "authored",
  "domain": 2,
  "topic": "Glue catalog partition indexes",
  "difficulty": "medium",
  "multi": false,
  "question": "A Glue Data Catalog table has 800,000 partitions. Queries that filter on a subset of partition keys spend a long time in planning while the catalog evaluates partition predicates. Which feature reduces that time without changing the physical layout?",
  "choices": {
   "A": "Create a partition index on the frequently filtered partition keys so the catalog can filter partitions efficiently.",
   "B": "Enable the Glue crawler's incremental crawl option.",
   "C": "Convert the table's SerDe from Parquet to ORC.",
   "D": "Increase the Athena query result reuse window to 24 hours."
  },
  "answer": [
   "A"
  ],
  "explanation": "Partition indexes let the Glue Data Catalog evaluate GetPartitions filters against an index instead of scanning all partition metadata, which is the planning bottleneck at this scale — and it is pure metadata, so no data is rewritten. Incremental crawls (option B) shorten crawler runs, not query planning. Changing the file format (option C) affects scan efficiency, not partition metadata lookup. Result reuse (option D) helps repeated identical queries while first-run planning stays slow."
 },
 {
  "id": "dea-94",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB global tables",
  "difficulty": "medium",
  "multi": false,
  "question": "An application must serve low-latency reads and writes to users in three Regions, with the same table data available in all three and automatic conflict resolution. Which DynamoDB feature meets this?",
  "choices": {
   "A": "DynamoDB global tables, which provide multi-Region, multi-active replication with last-writer-wins conflict resolution.",
   "B": "DynamoDB Streams with a Lambda function that copies writes to tables in the other Regions.",
   "C": "Cross-Region on-demand backups restored hourly into the other Regions.",
   "D": "DynamoDB Accelerator clusters deployed in each Region."
  },
  "answer": [
   "A"
  ],
  "explanation": "Global tables are the managed multi-Region, multi-active replication feature, replicating changes between replicas typically within a second and resolving concurrent writes with last writer wins. A hand-built Streams-and-Lambda replicator (option B) is what global tables replaced and leaves conflict handling, ordering and failure recovery to you. Hourly backup restores (option C) are far too coarse and not multi-active. DAX (option D) is a read cache in front of a single table and replicates nothing."
 },
 {
  "id": "dea-95",
  "source": "authored",
  "domain": 2,
  "topic": "Data modelling for the warehouse",
  "difficulty": "medium",
  "multi": false,
  "question": "A team is designing a Redshift schema for business intelligence users who write ad hoc SQL. They want good query performance and a model that analysts find easy to reason about. Which model should they choose?",
  "choices": {
   "A": "A star schema: a central fact table with numeric measures joined to denormalised dimension tables.",
   "B": "A fully normalised third normal form model mirroring the source OLTP system.",
   "C": "A single wide table containing every attribute, with no dimensions.",
   "D": "A document model with nested JSON columns for each business entity."
  },
  "answer": [
   "A"
  ],
  "explanation": "Star schemas are the standard analytical model: few joins per query, dimensions that are readable and small enough to distribute well, and a shape BI tools and analysts expect. Third normal form (option B) mirrors transactional needs and forces analysts through many joins. A single wide table (option C) removes joins but duplicates dimension attributes on every row, making conformed reporting and slowly changing attributes painful. Nested JSON columns (option D) fight the columnar engine and complicate ad hoc SQL."
 },
 {
  "id": "dea-96",
  "source": "authored",
  "domain": 2,
  "topic": "AWS Backup for analytics data stores",
  "difficulty": "medium",
  "multi": false,
  "question": "A compliance team requires one central place to define, schedule and prove backup retention across Amazon DynamoDB tables, Amazon RDS databases and Amazon EFS file systems in many accounts. Which service should the platform team use?",
  "choices": {
   "A": "AWS Backup, using backup plans and vaults applied across accounts through AWS Organizations.",
   "B": "A Lambda function scheduled by EventBridge that calls each service's own snapshot API.",
   "C": "AWS Config rules that check whether snapshots exist.",
   "D": "Amazon Data Lifecycle Manager policies for each service."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Backup centralises backup policy across many supported services and accounts, with backup plans, vaults, vault lock for immutability and reporting that satisfies audit evidence requirements. Custom Lambda snapshot code (option B) recreates all of this and provides no unified reporting. Config rules (option C) detect non-compliance but perform no backups. Data Lifecycle Manager (option D) covers EBS snapshots and AMIs, not DynamoDB, RDS and EFS together."
 },
 {
  "id": "dea-97",
  "source": "authored",
  "domain": 2,
  "topic": "EMRFS versus HDFS",
  "difficulty": "medium",
  "multi": false,
  "question": "An EMR cluster is transient and is recreated for each nightly run. Where should the job's input and output datasets be stored so that data survives cluster termination and is shareable with other services?",
  "choices": {
   "A": "In Amazon S3, accessed through EMRFS with s3:// paths, using HDFS only for transient intermediate data.",
   "B": "In HDFS on the core nodes, with a final DistCp to Amazon S3 only if another team asks for the data.",
   "C": "In the instance store of the task nodes for maximum throughput.",
   "D": "In an Amazon EBS volume attached to the primary node."
  },
  "answer": [
   "A"
  ],
  "explanation": "For transient clusters, S3 is the durable system of record: it outlives any cluster, is readable by Athena, Redshift Spectrum and Glue, and EMRFS lets Spark and Hive address it with s3:// paths, while HDFS is left for shuffle and scratch. HDFS on core nodes (option B) disappears when the cluster terminates, making the copy mandatory rather than optional. Instance store (option C) is ephemeral even within a node's life. A single EBS volume on the primary node (option D) is a single point of failure and not shareable."
 },
 {
  "id": "dea-98",
  "source": "authored",
  "domain": 2,
  "topic": "S3 Intelligent-Tiering",
  "difficulty": "easy",
  "multi": false,
  "question": "A data lake prefix holds objects whose access pattern is genuinely unknown and changes over time. The team wants automatic cost optimisation without retrieval fees on unexpected access and without building lifecycle rules. Which storage class fits?",
  "choices": {
   "A": "S3 Intelligent-Tiering, which moves objects between access tiers automatically based on observed access with no retrieval fees for the frequent and infrequent tiers.",
   "B": "S3 Standard-IA, accepting the retrieval fee when access is unexpected.",
   "C": "S3 One Zone-IA, to halve storage cost.",
   "D": "S3 Glacier Flexible Retrieval, with expedited retrievals enabled."
  },
  "answer": [
   "A"
  ],
  "explanation": "Intelligent-Tiering is designed for unknown or changing access patterns: it monitors each object and moves it between frequent, infrequent and optional archive tiers automatically, charging a small monitoring fee instead of retrieval fees in the non-archive tiers. Standard-IA (option B) charges per-GB retrieval and has a minimum storage duration, which punishes unexpected reads. One Zone-IA (option C) also reduces durability to a single Availability Zone. Glacier Flexible Retrieval (option D) is for archival data that is rarely accessed and needs minutes to hours to retrieve."
 },
 {
  "id": "dea-99",
  "source": "authored",
  "domain": 2,
  "topic": "Choosing Hudi, Iceberg or Delta",
  "difficulty": "hard",
  "multi": true,
  "question": "A team is moving a plain Parquet data lake table to an open transactional table format. Which TWO capabilities do formats such as Apache Iceberg, Apache Hudi and Delta Lake add over plain Parquet with Hive-style partitions?",
  "choices": {
   "A": "Atomic, row-level inserts, updates and deletes through statements such as MERGE INTO.",
   "B": "Snapshot isolation and time travel, so readers see a consistent table version while writers commit.",
   "C": "Column-level compression, which plain Parquet cannot provide.",
   "D": "Elimination of the need for any compute engine to read the data.",
   "E": "Automatic replication of the table to other AWS Regions."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Transactional table formats add a metadata layer over the data files that enables atomic row-level DML and snapshot isolation with time travel — the two capabilities plain Parquet on S3 lacks. Columnar compression (option C) is already a Parquet feature; the table formats usually store data as Parquet themselves. Reading still requires a query engine such as Spark, Athena or Trino (option D). Cross-Region replication (option E) is a storage-layer concern handled by S3 Replication, not by the table format."
 },
 {
  "id": "dea-100",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift automatic table optimization",
  "difficulty": "medium",
  "multi": false,
  "question": "A Redshift cluster hosts hundreds of tables created by many teams, and nobody consistently chooses distribution and sort keys. The platform team wants Redshift to improve those choices over time based on observed query patterns. What should they enable?",
  "choices": {
   "A": "Automatic table optimization, which observes workloads and applies distribution and sort key recommendations to eligible tables.",
   "B": "Concurrency scaling on the cluster's default queue.",
   "C": "Short query acceleration with a manually set maximum runtime.",
   "D": "Cross-database queries so tables can be reorganised per database."
  },
  "answer": [
   "A"
  ],
  "explanation": "Automatic table optimization monitors query patterns and applies sort and distribution key changes to tables set to AUTO, which is exactly the requirement to improve physical design without central manual review. Concurrency scaling (option B) adds transient capacity. Short query acceleration (option C) prioritises brief queries and changes no table design. Cross-database queries (option D) let one connection read other databases in the cluster and have nothing to do with physical optimisation."
 },
 {
  "id": "dea-101",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB export to S3",
  "difficulty": "medium",
  "multi": false,
  "question": "Analysts need to run large analytical queries over a 6 TB DynamoDB table without affecting the production workload's latency or consuming table capacity. Which approach meets the requirement?",
  "choices": {
   "A": "Use DynamoDB's export to Amazon S3 feature, which reads from continuous backups without consuming table read capacity, then query the exported data with Amazon Athena.",
   "B": "Run a parallel Scan with a rate limiter during off-peak hours and write the results to Amazon S3.",
   "C": "Create a global secondary index that projects all attributes and let analysts query the index.",
   "D": "Enable DAX and point the analytical queries at the DAX cluster."
  },
  "answer": [
   "A"
  ],
  "explanation": "Export to S3 uses the table's continuous backups, so it consumes no table read capacity and cannot affect production latency, and the exported DynamoDB JSON or Ion files are directly queryable with Athena. A rate-limited parallel Scan (option B) still burns read capacity and competes with production. A full-projection GSI (option C) doubles storage and write cost and is still an operational-path index. DAX (option D) is a low-latency cache for point reads and would be thrashed, not helped, by analytical scans."
 },
 {
  "id": "dea-102",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB point-in-time recovery",
  "difficulty": "easy",
  "multi": false,
  "question": "A faulty deployment overwrote thousands of items in a DynamoDB table twenty minutes ago. The team must restore the table to its state just before the incident with per-second granularity. Which feature makes this possible?",
  "choices": {
   "A": "Point-in-time recovery, which allows restoring the table to any second within the retention window.",
   "B": "On-demand backup, which captures the table at the moment the backup was requested.",
   "C": "DynamoDB Streams, replaying the change records in reverse.",
   "D": "Global tables, promoting a replica in another Region."
  },
  "answer": [
   "A"
  ],
  "explanation": "PITR continuously backs up the table and supports restoring to any second in the retention window, which is what a twenty-minute-old corruption needs — and it must have been enabled beforehand. On-demand backups (option B) only give the discrete moments someone chose to take them. Streams (option C) retain 24 hours of change records but there is no supported reverse-replay mechanism, and building one is error prone. Global tables (option D) replicate the bad writes to every replica within seconds."
 },
 {
  "id": "dea-103",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift column encoding",
  "difficulty": "medium",
  "multi": false,
  "question": "A Redshift table loaded from a legacy migration has all columns declared with RAW encoding, and the table occupies far more disk than expected. The team wants Redshift to choose appropriate compression for the data. What should they do?",
  "choices": {
   "A": "Run ANALYZE COMPRESSION to obtain recommendations, then rebuild the table with the suggested encodings — or let COPY apply automatic compression when loading into an empty table.",
   "B": "Run VACUUM FULL on the table, which applies compression as it re-sorts.",
   "C": "Change the table's distribution style to ALL so each node stores a compressed copy.",
   "D": "Enable concurrency scaling so compression is applied on the scaling clusters."
  },
  "answer": [
   "A"
  ],
  "explanation": "ANALYZE COMPRESSION samples the data and recommends per-column encodings, which are applied by recreating the table with those encodings; a COPY into an empty table with automatic compression does the same thing during the load. VACUUM (option B) reclaims space and re-sorts but does not change column encodings. DISTSTYLE ALL (option C) multiplies storage by the node count. Concurrency scaling (option D) is unrelated to storage layout."
 },
 {
  "id": "dea-104",
  "source": "authored",
  "domain": 2,
  "topic": "S3 Object Lock for retention",
  "difficulty": "medium",
  "multi": false,
  "question": "A regulator requires that transaction records be stored so that no one — including administrators — can delete or modify them for seven years. Which S3 configuration satisfies this?",
  "choices": {
   "A": "Enable S3 Object Lock in compliance mode with a seven-year retention period on a versioned bucket.",
   "B": "Enable S3 Object Lock in governance mode with a seven-year retention period.",
   "C": "Apply a bucket policy that denies s3:DeleteObject to all principals.",
   "D": "Enable S3 Versioning and a lifecycle rule that expires objects after seven years."
  },
  "answer": [
   "A"
  ],
  "explanation": "Compliance mode is the write-once-read-many setting where no principal, including the root user, can shorten the retention period or delete the object version before it expires — the only option that meets a truly immutable requirement. Governance mode (option B) can be overridden by principals holding the bypass permission. A bucket policy (option C) can be edited by anyone with policy permissions. Versioning with an expiry rule (option D) manages lifecycle but prevents nothing."
 },
 {
  "id": "dea-105",
  "source": "authored",
  "domain": 2,
  "topic": "S3 Storage Class Analysis",
  "difficulty": "easy",
  "multi": false,
  "question": "Before writing lifecycle rules for a large bucket, a team wants data on how objects are actually accessed as they age, so that transition ages are evidence based. Which feature provides that analysis?",
  "choices": {
   "A": "S3 Storage Class Analysis, which observes access patterns by age and recommends when to transition to infrequent access.",
   "B": "S3 Inventory, which lists objects and their metadata on a schedule.",
   "C": "S3 Server Access Logging, which records every request in a target bucket.",
   "D": "AWS Cost Explorer, filtered to the S3 service."
  },
  "answer": [
   "A"
  ],
  "explanation": "Storage Class Analysis is built for this decision: it groups objects by age and reports retrieval versus storage patterns, indicating when infrequent-access transitions become worthwhile. S3 Inventory (option B) is a flat listing with metadata and no access analysis. Server access logs (option C) hold the raw requests but would need a whole analysis pipeline built on top. Cost Explorer (option D) shows spend by service and storage class without object-level access ageing."
 },
 {
  "id": "dea-106",
  "source": "authored",
  "domain": 2,
  "topic": "Cross-Region replication for the lake",
  "difficulty": "medium",
  "multi": false,
  "question": "A data lake bucket must have a continuously updated copy in a second Region for disaster recovery, including objects that already exist and objects encrypted with AWS KMS. Which configuration meets this?",
  "choices": {
   "A": "Enable S3 Cross-Region Replication with a replication rule that includes KMS-encrypted objects and a destination key, and run S3 Batch Replication to copy the pre-existing objects.",
   "B": "Enable S3 Cross-Region Replication, which automatically backfills all pre-existing objects when the rule is created.",
   "C": "Schedule a daily aws s3 sync command from an EC2 instance in the destination Region.",
   "D": "Enable S3 Versioning in both buckets and rely on eventual convergence."
  },
  "answer": [
   "A"
  ],
  "explanation": "Replication rules apply to new objects from the moment they are created, so existing objects need S3 Batch Replication to backfill, and replicating KMS-encrypted objects requires the rule to opt in and to name a destination key with the right grants. Replication does not automatically backfill (option B). A daily sync from EC2 (option C) is not continuous, introduces a server and struggles at lake scale. Versioning alone (option D) replicates nothing between buckets."
 },
 {
  "id": "dea-107",
  "source": "authored",
  "domain": 2,
  "topic": "Amazon ElastiCache for lookups",
  "difficulty": "medium",
  "multi": false,
  "question": "A stream-processing application performs a lookup against a small, frequently read reference dataset for every event, and the backing relational database is now the bottleneck at 60,000 lookups per second. Which change relieves the pressure with sub-millisecond reads?",
  "choices": {
   "A": "Put the reference data in Amazon ElastiCache and read from the cache, refreshing it when the source changes.",
   "B": "Add read replicas to the relational database and load-balance lookups across them.",
   "C": "Move the reference data into Amazon S3 and read it with S3 Select per event.",
   "D": "Increase the relational database instance size to the largest available."
  },
  "answer": [
   "A"
  ],
  "explanation": "A small, hot, read-mostly dataset is the textbook in-memory cache case: ElastiCache serves it with sub-millisecond latency at very high request rates and removes essentially all of that load from the database. Read replicas (option B) help but add replica lag, cost and connection management for what remains a disk-backed engine. Per-event S3 reads (option C) add tens of milliseconds per lookup. A bigger instance (option D) postpones the ceiling at significant cost."
 },
 {
  "id": "dea-108",
  "source": "authored",
  "domain": 2,
  "topic": "File size targets in the lake",
  "difficulty": "medium",
  "multi": false,
  "question": "A team is defining lake standards for Parquet output. Which target best balances query planning overhead against parallelism for engines such as Athena, Spark and Trino?",
  "choices": {
   "A": "Aim for files of roughly 128 MB to 1 GB, with row groups sized so that engines can read blocks in parallel.",
   "B": "Aim for files of 1 MB to 5 MB so each task finishes quickly.",
   "C": "Aim for one file per partition regardless of size, even if that means 20 GB files.",
   "D": "Aim for 10 KB files so that Amazon S3 request parallelism is maximised."
  },
  "answer": [
   "A"
  ],
  "explanation": "Files in the low hundreds of megabytes amortise per-file open, list and metadata cost while still splitting into enough row groups for parallel reads — the widely used guidance across Athena, Spark and Trino. Very small files (options B and D) create request and task overhead that dominates the actual work, and tiny objects also carry per-request cost. A single huge file per partition (option C) limits parallelism and makes any rewrite expensive."
 },
 {
  "id": "dea-109",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift temporary and staging tables",
  "difficulty": "medium",
  "multi": false,
  "question": "An ETL procedure in Amazon Redshift creates a staging table with CREATE TABLE, loads it, merges into the target and drops it, every fifteen minutes. Over time the system tables show heavy bloat and the procedure has slowed. What is the better pattern?",
  "choices": {
   "A": "Use a temporary table created with CREATE TEMP TABLE (or CREATE TEMP TABLE AS) so it is session scoped, unlogged in the catalog long term, and cleaned up automatically.",
   "B": "Keep the permanent staging table but TRUNCATE instead of dropping it between runs, and run ANALYZE afterwards.",
   "C": "Create the staging table with DISTSTYLE ALL to make the merge faster.",
   "D": "Move the staging table into a separate database in the same cluster."
  },
  "answer": [
   "A"
  ],
  "explanation": "Repeatedly creating and dropping permanent tables churns catalog metadata; temporary tables are session scoped, disappear automatically at session end and avoid that churn, which is why they are the standard Redshift staging construct. Truncate and reuse (option B) is a genuine improvement over create-and-drop and is a defensible pattern, but it keeps a permanent object and its statistics maintenance, so it is second best here. DISTSTYLE ALL (option C) replicates the staging data to every node. A separate database (option D) relocates the churn without reducing it."
 },
 {
  "id": "dea-110",
  "source": "authored",
  "domain": 2,
  "topic": "Table statistics for Athena",
  "difficulty": "hard",
  "multi": false,
  "question": "Queries in Amazon Athena that join several large tables choose poor join orders. The team wants the engine's cost-based optimizer to make better decisions. What should they do?",
  "choices": {
   "A": "Generate and register column-level table statistics in the AWS Glue Data Catalog for the tables involved so Athena's cost-based optimizer can use them.",
   "B": "Rewrite every query to hint the join order manually with a series of nested subqueries.",
   "C": "Increase the Athena workgroup's per-query data scan limit.",
   "D": "Convert the tables from Parquet to Avro so the optimizer can read row counts more easily."
  },
  "answer": [
   "A"
  ],
  "explanation": "Athena's cost-based optimizer needs statistics — row counts, distinct values, null fractions — which can be collected into the Glue Data Catalog for a table's columns; with those present the planner reorders joins sensibly. Manual query rewriting (option B) is a per-query workaround that decays as data changes. A scan limit (option C) is a guardrail, not an optimisation input. Avro (option D) is row oriented and would make the scans themselves much worse."
 },
 {
  "id": "dea-111",
  "source": "authored",
  "domain": 2,
  "topic": "Aurora read scaling for analytics",
  "difficulty": "medium",
  "multi": false,
  "question": "Reporting queries against an Amazon Aurora MySQL cluster are slowing the transactional workload. The reports tolerate data that is a few seconds stale. What is the appropriate change?",
  "choices": {
   "A": "Point the reporting workload at the cluster reader endpoint served by Aurora Replicas, so reads are isolated from the writer.",
   "B": "Increase the writer instance size and continue running reports against the writer endpoint.",
   "C": "Enable Aurora backtrack and run reports against the backtracked state.",
   "D": "Create a nightly snapshot and restore it into a second cluster for reporting."
  },
  "answer": [
   "A"
  ],
  "explanation": "Aurora Replicas read from the same shared storage volume with replica lag usually in the tens of milliseconds, so the reader endpoint isolates reporting from the writer while comfortably meeting a few-seconds staleness tolerance. A larger writer (option B) keeps both workloads competing on one instance. Backtrack (option C) rewinds the cluster in place for recovery and is not a reporting mechanism. Nightly snapshot restores (option D) give day-old data and a second cluster to manage."
 },
 {
  "id": "dea-112",
  "source": "authored",
  "domain": 2,
  "topic": "Data retention and expiry",
  "difficulty": "easy",
  "multi": false,
  "question": "A privacy policy requires that raw clickstream objects in Amazon S3 be permanently deleted 400 days after creation, with no manual intervention. Which mechanism should be used?",
  "choices": {
   "A": "An S3 Lifecycle expiration rule at 400 days, together with a rule to permanently delete noncurrent versions if the bucket is versioned.",
   "B": "An S3 Lifecycle transition rule to S3 Glacier Deep Archive at 400 days.",
   "C": "A weekly Lambda function that lists the bucket and deletes objects older than 400 days.",
   "D": "S3 Object Lock with a 400-day retention period."
  },
  "answer": [
   "A"
  ],
  "explanation": "Lifecycle expiration deletes objects at the configured age automatically, and on a versioned bucket the noncurrent-version expiration rule is needed as well, otherwise delete markers hide versions that still exist. Transitioning to Deep Archive (option B) retains the data rather than deleting it. A custom Lambda sweeper (option C) reimplements a native feature and can miss objects or fail silently at scale. Object Lock (option D) prevents deletion for the retention period — the opposite of the requirement."
 },
 {
  "id": "dea-113",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift cross-database queries",
  "difficulty": "medium",
  "multi": false,
  "question": "An Amazon Redshift RA3 cluster hosts several databases for different business units. An analyst needs to join a table in the finance database with one in the marketing database from a single connection. What supports this?",
  "choices": {
   "A": "Cross-database queries, which let a session query objects in other databases in the same cluster using three-part names.",
   "B": "Redshift federated query to Amazon RDS.",
   "C": "A datashare between the two databases and an AWS RAM grant.",
   "D": "Redshift Spectrum external schemas over each database."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cross-database queries let a connection to one database reference objects in other databases of the same RA3 cluster with database.schema.table names, so the join needs no copying and no second connection. Federated query (option B) reaches out to external PostgreSQL or MySQL databases. Datashares (option C) are for sharing between different clusters or namespaces, not databases inside one cluster. Spectrum (option D) reads external data in S3."
 },
 {
  "id": "dea-114",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB item size and modelling",
  "difficulty": "hard",
  "multi": false,
  "question": "A DynamoDB design stores each customer as one item containing an ever-growing list of their orders. Some items are approaching the 400 KB limit and updates are consuming large amounts of write capacity. What is the correct redesign?",
  "choices": {
   "A": "Split orders into separate items in the same item collection, using customer_id as the partition key and an order-specific sort key.",
   "B": "Compress the order list attribute with gzip and store it as binary.",
   "C": "Move the order list into a second table keyed by a hash of the list contents.",
   "D": "Request a service quota increase for the maximum item size."
  },
  "answer": [
   "A"
  ],
  "explanation": "The problem is an unbounded collection modelled inside a single item, so every append rewrites the whole item and the 400 KB ceiling looms. Splitting orders into individual items sharing the customer partition key keeps writes small and constant while a single Query still returns a customer's orders. Compression (option B) postpones the limit and makes every read decompress the entire history. Keying a second table by a content hash (option C) makes lookups by customer impossible. The 400 KB item size limit is not adjustable (option D)."
 },
 {
  "id": "dea-115",
  "source": "authored",
  "domain": 2,
  "topic": "Cataloguing streaming output",
  "difficulty": "medium",
  "multi": false,
  "question": "A Firehose stream delivers Parquet files into a date-partitioned S3 prefix. Analysts complain that yesterday's data is not visible in Athena until someone runs a crawler. The team wants new partitions to be queryable automatically without a scheduled crawler. Which approach is best?",
  "choices": {
   "A": "Configure partition projection on the table so Athena derives the date partitions from a range and location template.",
   "B": "Run MSCK REPAIR TABLE manually each morning.",
   "C": "Shorten the crawler schedule to every five minutes.",
   "D": "Have Firehose write all files into a single unpartitioned prefix."
  },
  "answer": [
   "A"
  ],
  "explanation": "Partition projection computes the partition set from configured ranges and a storage location template, so a new day's prefix is queryable the moment files land, with no crawler and no repair statement. MSCK REPAIR each morning (option B) is the manual step the team wants to eliminate. A five-minute crawler (option C) works but adds continuous cost and still leaves a window of invisibility. Removing partitioning (option D) makes every query scan all history."
 },
 {
  "id": "dea-116",
  "source": "authored",
  "domain": 2,
  "topic": "Choosing a data store for the access pattern",
  "difficulty": "medium",
  "multi": false,
  "question": "An application needs single-digit millisecond lookups of a user profile by user ID, at 100,000 requests per second, with a flexible attribute set per user and no complex joins. Which store fits best?",
  "choices": {
   "A": "Amazon DynamoDB with user_id as the partition key.",
   "B": "Amazon Redshift with a user dimension table.",
   "C": "Amazon Athena over Parquet files in Amazon S3.",
   "D": "Amazon OpenSearch Service with one document per user."
  },
  "answer": [
   "A"
  ],
  "explanation": "Key-based lookups at very high request rates with schemaless attributes is DynamoDB's core design point, and a partition key on user_id gives consistent single-digit millisecond reads at any scale. Redshift (option B) is a columnar analytical warehouse, poor at high-concurrency point lookups. Athena (option C) has query latency measured in seconds and is not an operational store. OpenSearch (option D) excels at search and aggregation over text but is a heavier, more expensive choice for pure primary-key retrieval."
 },
 {
  "id": "dea-117",
  "source": "authored",
  "domain": 2,
  "topic": "Bucketing and sorting within partitions",
  "difficulty": "hard",
  "multi": false,
  "question": "A partitioned lake table is queried with a date filter plus an equality filter on a high-cardinality user_id. Date pruning already works, but each partition is still scanned in full. Which change most reduces bytes scanned without exploding the partition count?",
  "choices": {
   "A": "Sort or cluster the data by user_id within each partition so Parquet row-group statistics allow row groups to be skipped, or bucket the table on user_id.",
   "B": "Add user_id as an additional partition key.",
   "C": "Store the table as uncompressed CSV so filters can be applied line by line.",
   "D": "Create a view that filters by user_id."
  },
  "answer": [
   "A"
  ],
  "explanation": "Sorting or clustering by the filtered column makes each Parquet row group cover a narrow range of user_id values, so the reader's min/max statistics let it skip most row groups — and bucketing achieves a similar effect by hashing rows into a fixed number of files. Partitioning by a high-cardinality user_id (option B) is exactly the partition explosion the question rules out. Uncompressed CSV (option C) increases bytes scanned enormously and offers no statistics. A view (option D) is a query rewrite with no effect on physical layout."
 },
 {
  "id": "dea-118",
  "source": "authored",
  "domain": 2,
  "topic": "Amazon Neptune",
  "difficulty": "easy",
  "multi": false,
  "question": "A fraud team must traverse relationships such as shared devices, addresses and payment instruments across accounts, running queries like 'find all accounts within four hops of this device'. Which database is purpose built for this?",
  "choices": {
   "A": "Amazon Neptune, a managed graph database supporting Gremlin, openCypher and SPARQL.",
   "B": "Amazon DynamoDB with adjacency-list modelling and recursive application-side queries.",
   "C": "Amazon Redshift with recursive common table expressions.",
   "D": "Amazon OpenSearch Service with nested documents."
  },
  "answer": [
   "A"
  ],
  "explanation": "Multi-hop relationship traversal is exactly what a graph database is optimised for, and Neptune is the managed AWS option with the standard graph query languages. DynamoDB adjacency lists (option B) can model a graph but each hop is an application round trip, which is slow and complex at four hops. Redshift recursive CTEs (option C) can walk a hierarchy but a warehouse is not built for this access pattern at interactive speed. OpenSearch (option D) is a search engine without graph traversal semantics."
 },
 {
  "id": "dea-119",
  "source": "authored",
  "domain": 2,
  "topic": "Hot and cold storage split",
  "difficulty": "medium",
  "multi": true,
  "question": "A company keeps 18 months of data in Amazon Redshift but only the last 3 months are queried regularly. Costs are rising and the cluster is near capacity. Which TWO changes reduce cost while keeping all 18 months queryable?",
  "choices": {
   "A": "UNLOAD data older than 3 months to Amazon S3 in Parquet and query it through Redshift Spectrum external tables.",
   "B": "Migrate the cluster to RA3 nodes so older data is held in Redshift Managed Storage and billed separately from compute.",
   "C": "Delete data older than 3 months and restore it from snapshots when it is needed.",
   "D": "Convert all tables to DISTSTYLE ALL to reduce total storage.",
   "E": "Disable automated snapshots to reclaim storage."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Both options preserve queryability while cutting cost: offloading cold months to S3 and reading them with Spectrum moves the bulk of the data to cheap storage still reachable from SQL, and RA3 nodes decouple storage from compute so the cluster is sized for the working set. Deleting and restoring on demand (option C) makes older data unqueryable until someone restores a cluster. DISTSTYLE ALL (option D) multiplies storage by node count. Disabling snapshots (option E) trades away recovery for a small saving and does not address the working-set problem."
 },
 {
  "id": "dea-120",
  "source": "authored",
  "domain": 2,
  "topic": "Catalog design for multiple environments",
  "difficulty": "medium",
  "multi": false,
  "question": "A platform team must keep development, test and production lake tables logically separated while using the same tooling and naming conventions in each environment. Which approach is cleanest in the AWS Glue Data Catalog?",
  "choices": {
   "A": "Use separate AWS accounts per environment, each with its own Glue Data Catalog, and share specific production tables read-only where needed.",
   "B": "Use one account and one database, prefixing every table name with dev_, test_ or prod_.",
   "C": "Use one account and one database, distinguishing environments with table properties only.",
   "D": "Use one account and rely on IAM policies with wildcards on table names to isolate environments."
  },
  "answer": [
   "A"
  ],
  "explanation": "Account-level separation gives the strongest blast-radius and permission boundary, keeps identical names and tooling in each environment, and still allows deliberate read-only sharing of production data through Lake Formation or catalog resource policies. Name prefixes (option B) and table properties (option C) rely on convention, so a mistake in a job or a policy reaches production data. Wildcard IAM policies in one account (option D) are brittle and depend entirely on naming discipline being perfect."
 },
 {
  "id": "dea-121",
  "source": "authored",
  "domain": 3,
  "topic": "Kinesis consumer lag alarms",
  "difficulty": "medium",
  "multi": false,
  "question": "An operations team must be paged when a Kinesis stream consumer falls behind by more than five minutes, before data reaches the end of the 24-hour retention window. Which metric should the CloudWatch alarm use?",
  "choices": {
   "A": "GetRecords.IteratorAgeMilliseconds, alarming when it exceeds 300,000.",
   "B": "IncomingBytes, alarming when it drops below the daily average.",
   "C": "WriteProvisionedThroughputExceeded, alarming on any non-zero value.",
   "D": "PutRecord.Latency, alarming above the p99 baseline."
  },
  "answer": [
   "A"
  ],
  "explanation": "IteratorAge measures how old the records being processed are, which is precisely consumer lag; alarming above 300,000 milliseconds fires at five minutes behind, well inside a 24-hour retention window. IncomingBytes (option B) describes producer volume and would false-alarm on any quiet period. WriteProvisionedThroughputExceeded (option C) signals producer-side throttling. PutRecord latency (option D) reflects the write path and says nothing about how far behind consumers are."
 },
 {
  "id": "dea-122",
  "source": "authored",
  "domain": 3,
  "topic": "CloudWatch Logs Insights",
  "difficulty": "medium",
  "multi": false,
  "question": "After a pipeline incident, an engineer must find, across several Lambda log groups, how many invocations logged a specific error string per hour over the last two days. Which tool answers this fastest with no additional infrastructure?",
  "choices": {
   "A": "CloudWatch Logs Insights, running a query with filter and stats by bin over the selected log groups.",
   "B": "Export the log groups to Amazon S3 and query them with Amazon Athena.",
   "C": "Stream the log groups to Amazon OpenSearch Service and build a dashboard.",
   "D": "Download the log streams with the AWS CLI and grep them locally."
  },
  "answer": [
   "A"
  ],
  "explanation": "Logs Insights queries log groups in place with a purpose-built query language — filter for the string, stats count() by bin(1h) — over multiple log groups at once, and needs nothing set up in advance. Exporting to S3 and using Athena (option B) works but requires an export job and a table before any answer appears. Streaming to OpenSearch (option C) is worth doing for ongoing analysis, not for an urgent one-off question. Local grepping (option D) is slow and error prone across many streams."
 },
 {
  "id": "dea-123",
  "source": "authored",
  "domain": 3,
  "topic": "Athena cost controls",
  "difficulty": "medium",
  "multi": false,
  "question": "Several teams share an AWS account and Amazon Athena spend has become unpredictable, driven by a few runaway queries. The platform team must cap the data any single query can scan and track spend per team. What should they configure?",
  "choices": {
   "A": "Separate Athena workgroups per team, each with a per-query data scanned limit, a workgroup-level limit and cost allocation tags.",
   "B": "An AWS Budgets action that stops Athena when the monthly budget is exceeded.",
   "C": "An IAM policy that denies athena:StartQueryExecution outside business hours.",
   "D": "A Service Control Policy limiting the number of concurrent Athena queries."
  },
  "answer": [
   "A"
  ],
  "explanation": "Workgroups are Athena's isolation and governance boundary: each can enforce a per-query bytes-scanned limit that cancels a runaway query, apply an aggregate limit, publish its own metrics, and carry tags for cost allocation — meeting both requirements directly. Budgets actions (option B) react after spend occurs and are coarse. Time-based deny policies (option C) do not stop a runaway query during business hours. An SCP (option D) cannot express a bytes-scanned limit."
 },
 {
  "id": "dea-124",
  "source": "authored",
  "domain": 3,
  "topic": "Glue job failure notifications",
  "difficulty": "easy",
  "multi": false,
  "question": "A team must be notified by email whenever any AWS Glue job in the account fails, without editing each job's script. Which solution is simplest?",
  "choices": {
   "A": "Create an Amazon EventBridge rule matching the Glue Job State Change event with state FAILED, targeting an Amazon SNS topic with email subscriptions.",
   "B": "Add a try/except block to every Glue script that publishes to Amazon SNS on error.",
   "C": "Create a CloudWatch alarm on the glue.driver.aggregate.numFailedTasks metric for each job.",
   "D": "Poll the GetJobRuns API from a Lambda function every minute and compare states."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue emits Job State Change events to EventBridge, so a single rule filtering on state FAILED covers every job in the account, present and future, with an SNS topic as the target — no script changes. Per-script error handling (option B) means editing every job and misses failures that kill the driver outright. Per-job task-failure alarms (option C) need one alarm per job and can fire on retried tasks that ultimately succeed. Polling the API (option D) is custom code doing what an event already provides."
 },
 {
  "id": "dea-125",
  "source": "authored",
  "domain": 3,
  "topic": "Redshift query monitoring rules",
  "difficulty": "hard",
  "multi": false,
  "question": "On a shared Redshift cluster, occasional badly written analyst queries run for hours and consume most of the cluster's resources. The team wants such queries aborted automatically when they exceed defined thresholds, without a human watching. What should they configure?",
  "choices": {
   "A": "WLM query monitoring rules with predicates such as query execution time or rows scanned, and an action of abort or change priority.",
   "B": "A statement timeout set globally on the cluster parameter group at the lowest value any workload can tolerate.",
   "C": "Concurrency scaling with a maximum of ten scaling clusters.",
   "D": "An IAM policy denying redshift-data:ExecuteStatement to analyst roles."
  },
  "answer": [
   "A"
  ],
  "explanation": "Query monitoring rules attach predicates — execution time, rows or bytes scanned, spill, CPU — to a WLM queue and act automatically by logging, changing priority, hopping or aborting the query, which is the targeted control described. A global statement timeout (option B) is blunt and would kill legitimate long ETL. Concurrency scaling (option C) adds capacity for queued queries and would happily scale out the bad query's neighbours at extra cost. Denying analysts access to the Data API (option D) blocks the workload rather than governing it."
 },
 {
  "id": "dea-126",
  "source": "authored",
  "domain": 3,
  "topic": "Glue job run insights and Spark UI",
  "difficulty": "medium",
  "multi": false,
  "question": "An AWS Glue Spark job intermittently takes four times longer than usual. The team needs to see stage-level detail, skew and shuffle behaviour for a specific failed or slow run. What should they enable?",
  "choices": {
   "A": "Enable the Spark UI and job run insights on the job so event logs are written to Amazon S3 and can be inspected per run.",
   "B": "Enable continuous logging only, and read the driver output in CloudWatch Logs.",
   "C": "Enable job bookmarks so the run processes less data next time.",
   "D": "Enable CloudTrail data events for the S3 bucket the job reads."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue can write Spark event logs to S3 for viewing in the Spark history UI, and job run insights surface stage-level analysis and common failure root causes — exactly the stage, shuffle and skew detail needed. Continuous logging (option B) helps a lot for driver and executor messages but does not give the stage timeline and task distribution view. Bookmarks (option C) change what is processed rather than explaining the slowdown. CloudTrail data events (option D) record S3 API calls, not Spark execution behaviour."
 },
 {
  "id": "dea-127",
  "source": "authored",
  "domain": 3,
  "topic": "Pipeline deployment automation",
  "difficulty": "medium",
  "multi": false,
  "question": "A data team deploys Glue jobs, Step Functions state machines and S3 buckets by hand in three environments, and configuration drifts between them. They want reviewable, repeatable deployments with the same definitions promoted from dev to prod. What should they adopt?",
  "choices": {
   "A": "Define the resources as infrastructure as code with AWS CloudFormation or the AWS CDK, store them in source control and deploy through a CI/CD pipeline with environment-specific parameters.",
   "B": "Write a runbook describing each console step and require two engineers to follow it together.",
   "C": "Take an AWS Backup of each environment and restore it into the next environment.",
   "D": "Use AWS Config to detect drift and have engineers correct it manually each week."
  },
  "answer": [
   "A"
  ],
  "explanation": "Infrastructure as code in a CI/CD pipeline gives exactly what is asked: definitions under review in source control, identical templates promoted through environments with parameters for the differences, and repeatable deployments. A runbook (option B) still relies on humans repeating manual steps. AWS Backup (option C) protects data, and restores do not promote application configuration between environments. AWS Config drift detection (option D) reports divergence after the fact without preventing it."
 },
 {
  "id": "dea-128",
  "source": "authored",
  "domain": 3,
  "topic": "DMS task monitoring",
  "difficulty": "medium",
  "multi": false,
  "question": "An ongoing AWS DMS CDC task is falling behind and the target is minutes out of date. Which two metrics should the engineer look at first to distinguish a slow source capture from a slow target apply?",
  "choices": {
   "A": "CDCLatencySource and CDCLatencyTarget on the replication task.",
   "B": "FreeableMemory and CPUUtilization on the replication instance.",
   "C": "FullLoadThroughputRowsSource and FullLoadThroughputRowsTarget.",
   "D": "NetworkTransmitThroughput and SwapUsage."
  },
  "answer": [
   "A"
  ],
  "explanation": "CDCLatencySource measures the delay between a change occurring on the source and DMS capturing it, while CDCLatencyTarget measures the additional delay applying it to the target — comparing them localises the bottleneck immediately. Instance resource metrics (option B) matter next, once you know which side is slow. Full-load throughput metrics (option C) describe the initial load phase, not ongoing replication. Network and swap metrics (option D) are secondary symptoms."
 },
 {
  "id": "dea-129",
  "source": "authored",
  "domain": 3,
  "topic": "Step Functions error handling",
  "difficulty": "hard",
  "multi": false,
  "question": "A Step Functions workflow calls a third-party API that occasionally returns HTTP 429 and rarely returns a permanent validation error. The workflow must retry transient throttling with backoff, but fail fast on validation errors and record them. How should the state be configured?",
  "choices": {
   "A": "Add a Retry block matching the throttling error with an interval, backoff rate and maximum attempts, and a Catch block matching the validation error that routes to a state recording the failure.",
   "B": "Add a single Retry block with States.ALL and 10 attempts.",
   "C": "Wrap the call in a Map state with a concurrency of one so failures are isolated.",
   "D": "Set the state machine type to Express so failed executions are retried automatically."
  },
  "answer": [
   "A"
  ],
  "explanation": "Retry and Catch match on error names, so a Retry entry for the throttling error gives exponential backoff on transient failures while a separate Catch for the validation error transitions immediately to a recording state — different handling for different classes, which is the requirement. A blanket States.ALL retry (option B) wastes ten attempts on an error that will never succeed. A Map state (option C) controls iteration, not error classification. Express workflows (option D) differ in duration, pricing and history, and do not auto-retry business errors."
 },
 {
  "id": "dea-130",
  "source": "authored",
  "domain": 3,
  "topic": "Data quality monitoring over time",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants to detect when a daily table's row count, null rate or value distribution deviates from its historical norm, and be alerted before analysts notice. Which approach fits with the least custom statistics code?",
  "choices": {
   "A": "Use AWS Glue Data Quality with anomaly detection and rule recommendations, publishing results to CloudWatch and alerting on failures.",
   "B": "Write a nightly Athena query that compares today's row count to yesterday's and email the difference.",
   "C": "Enable S3 Storage Lens metrics on the table's prefix.",
   "D": "Turn on CloudTrail data events for the table's S3 prefix."
  },
  "answer": [
   "A"
  ],
  "explanation": "Glue Data Quality can recommend rules from a dataset, evaluate them per run and apply anomaly detection to metrics over time, so drift in row counts, null rates and distributions is caught without hand-built statistical baselines, and results can drive alerts. A day-over-day row count query (option B) catches only the crudest volume change and produces noise on normal weekly seasonality. Storage Lens (option C) reports storage metrics, not data content. CloudTrail data events (option D) log access, not quality."
 },
 {
  "id": "dea-131",
  "source": "authored",
  "domain": 3,
  "topic": "Athena query performance triage",
  "difficulty": "medium",
  "multi": false,
  "question": "An Athena query over a partitioned Parquet table scans 2 TB even though the WHERE clause filters to a single day. Which cause should be investigated first?",
  "choices": {
   "A": "The filter is applied to a column derived from the timestamp rather than to the partition key column, so no partition pruning occurs.",
   "B": "The result set is too large for the query result location.",
   "C": "The workgroup has query result reuse disabled.",
   "D": "The table uses Snappy compression rather than Gzip."
  },
  "answer": [
   "A"
  ],
  "explanation": "Full scans on a partitioned table almost always mean the predicate does not reach the partition key — for example filtering on date_parse of a timestamp column instead of the partition column itself, or comparing a string partition to a differently formatted literal — so Athena cannot prune prefixes. Result location size (option B) affects output writing, not input scanning. Result reuse (option C) only helps repeated identical queries. Compression codec (option D) changes bytes read somewhat but cannot explain scanning a day's filter across 2 TB."
 },
 {
  "id": "dea-132",
  "source": "authored",
  "domain": 3,
  "topic": "Cost allocation and tagging",
  "difficulty": "medium",
  "multi": false,
  "question": "Finance needs monthly analytics spend broken down by business unit across Glue, Athena, Redshift Serverless and S3, all in one account. What must the platform team do?",
  "choices": {
   "A": "Apply a consistent business-unit tag to the resources, activate it as a cost allocation tag in the Billing console, and report on it in AWS Cost Explorer or the Cost and Usage Report.",
   "B": "Create one AWS Budgets alert per business unit with a monthly threshold.",
   "C": "Enable AWS Cost Anomaly Detection on the account.",
   "D": "Ask each team to record its own usage in a spreadsheet each month."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cost allocation depends on tags being applied consistently and then activated as cost allocation tags, after which Cost Explorer and the Cost and Usage Report can group spend by that tag across every supporting service. Budgets (option B) alert on thresholds but do not produce the breakdown. Anomaly detection (option C) flags unusual spend without attributing baseline cost to business units. Manual spreadsheets (option D) are neither accurate nor sustainable."
 },
 {
  "id": "dea-133",
  "source": "authored",
  "domain": 3,
  "topic": "Troubleshooting access denied",
  "difficulty": "hard",
  "multi": false,
  "question": "An AWS Glue job that previously worked now fails reading an S3 bucket in another account with an access denied error. The job role's identity policy allows s3:GetObject on the bucket. Which checks are most likely to reveal the cause?",
  "choices": {
   "A": "Review the bucket policy in the owning account, the object ownership and ACL settings, and any AWS KMS key policy for the objects' encryption key, since cross-account access requires permission on both sides.",
   "B": "Verify the Glue job's worker type and increase the number of workers.",
   "C": "Check that the S3 bucket has versioning enabled.",
   "D": "Confirm the Glue job's bookmark state is not stale."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cross-account S3 access needs an allow on both sides: the caller's identity policy and the resource owner's bucket policy, plus a key policy grant if the objects use SSE-KMS, and object ownership settings determine whether ACLs still matter. A recent change on the owning side is the usual culprit. Worker configuration (option B) affects capacity, never authorisation. Versioning (option C) is unrelated to permission evaluation. Bookmark state (option D) changes which objects are read, not whether reads are allowed."
 },
 {
  "id": "dea-134",
  "source": "authored",
  "domain": 3,
  "topic": "Operational runbooks and automation",
  "difficulty": "medium",
  "multi": false,
  "question": "When a nightly pipeline fails, an on-call engineer currently performs the same five recovery steps by hand. The team wants the recovery executed automatically on failure, with an audit trail and the option to require approval before the destructive step. Which service fits best?",
  "choices": {
   "A": "AWS Systems Manager Automation runbooks, triggered by an EventBridge rule on the failure event, with an approval step before the destructive action.",
   "B": "A shell script stored in Amazon S3 that the engineer downloads and runs.",
   "C": "An Amazon SNS topic that emails the five steps to the on-call engineer.",
   "D": "A CloudWatch dashboard that displays the failure and the recovery instructions."
  },
  "answer": [
   "A"
  ],
  "explanation": "Systems Manager Automation encodes a runbook as executable steps with built-in approval actions and full execution history, and EventBridge can start it from the failure event — automation, audit trail and a human gate where it matters. A downloadable script (option B) still requires a human to run it and logs nothing centrally. Emailing steps (option C) and a dashboard with instructions (option D) are documentation, not automation."
 },
 {
  "id": "dea-135",
  "source": "authored",
  "domain": 3,
  "topic": "EMR step failure investigation",
  "difficulty": "medium",
  "multi": false,
  "question": "A Spark step on a transient EMR cluster failed and the cluster terminated automatically, so the engineer can no longer connect to it. How can the failure still be investigated?",
  "choices": {
   "A": "Read the archived step, application and container logs in the S3 log URI configured for the cluster, and use the persistent application user interfaces if they were enabled.",
   "B": "Restore the cluster from an EMR snapshot and reattach to the failed step.",
   "C": "Query CloudTrail management events for the Spark stack trace.",
   "D": "Enable termination protection retroactively so the cluster can be restarted."
  },
  "answer": [
   "A"
  ],
  "explanation": "EMR archives step, application and container logs to the configured S3 log URI, and the persistent application user interfaces keep the Spark history available after termination — so the whole failure is inspectable without the cluster. There is no EMR snapshot restore mechanism (option B). CloudTrail (option C) records control-plane API calls, never application stack traces. Termination protection (option D) cannot be applied retroactively to a cluster that is already gone."
 },
 {
  "id": "dea-136",
  "source": "authored",
  "domain": 3,
  "topic": "SLA alerting on data freshness",
  "difficulty": "hard",
  "multi": false,
  "question": "A curated table must be updated by 06:00 each day. The team wants an alert if the update has not happened by then, including cases where the pipeline never started at all. Which monitoring approach covers both failure modes?",
  "choices": {
   "A": "Emit a custom CloudWatch metric with a heartbeat on successful completion and alarm on missing data at 06:00, treating missing data as breaching.",
   "B": "Alarm on the Glue job's FAILED state change events only.",
   "C": "Alarm when the pipeline's Lambda function error count exceeds zero.",
   "D": "Check the table row count once a week and investigate anomalies."
  },
  "answer": [
   "A"
  ],
  "explanation": "Alerting only on failure signals cannot detect a pipeline that never ran, because no failure event is emitted. A success heartbeat metric inverted into an alarm — with the missing-data treatment set to breaching and evaluated at the deadline — catches both a failed run and a run that never started. Failure-state alarms (options B and C) miss the never-started case entirely. Weekly row-count checks (option D) are far too slow for a daily 06:00 commitment."
 },
 {
  "id": "dea-137",
  "source": "authored",
  "domain": 3,
  "topic": "Testing data pipelines",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants automated tests to run in a CI pipeline before Glue job changes reach production, catching logic errors without touching production data. Which approach is most practical?",
  "choices": {
   "A": "Factor the transformation logic into functions tested with unit tests over small fixture datasets, and run an integration test of the job against a dedicated test bucket and catalog in a non-production account.",
   "B": "Run the modified job against production data in read-only mode and compare the output visually.",
   "C": "Rely on Glue Data Quality rules in production to catch defects after deployment.",
   "D": "Require two engineers to review the pull request and skip automated tests."
  },
  "answer": [
   "A"
  ],
  "explanation": "Separating pure transformation logic from I/O makes it unit testable in seconds against fixtures, and a scoped integration run in a non-production account validates the wiring, catalog interaction and permissions — both runnable in CI. Reading production data (option B) risks exposure and gives no automated pass or fail. Production data quality rules (option C) are a valuable safety net but detect defects only after release. Review alone (option D) discards automation entirely."
 },
 {
  "id": "dea-138",
  "source": "authored",
  "domain": 3,
  "topic": "Firehose delivery monitoring",
  "difficulty": "medium",
  "multi": false,
  "question": "An Amazon Data Firehose stream to Amazon S3 occasionally drops behind and the team is not told. Which CloudWatch alarm gives the earliest reliable warning of a delivery problem?",
  "choices": {
   "A": "Alarm on DeliveryToS3.DataFreshness exceeding a threshold consistent with the stream's buffering configuration.",
   "B": "Alarm on IncomingRecords falling to zero.",
   "C": "Alarm on the destination bucket's BucketSizeBytes metric.",
   "D": "Alarm on the number of objects in the destination prefix each hour."
  },
  "answer": [
   "A"
  ],
  "explanation": "DataFreshness reports the age of the oldest record in Firehose that has not yet been delivered, so it rises as soon as delivery stalls and is the direct signal of a delivery problem. Zero incoming records (option B) indicates a producer outage, a different failure. BucketSizeBytes (option C) is a daily storage metric, far too coarse. Counting objects hourly (option D) requires custom tooling and reacts slowly."
 },
 {
  "id": "dea-139",
  "source": "authored",
  "domain": 3,
  "topic": "Sharing results with business users",
  "difficulty": "easy",
  "multi": false,
  "question": "Business users need self-service dashboards over curated data in Amazon Redshift and Amazon S3, with per-user row-level filtering and no infrastructure for the data team to run. Which service should be used?",
  "choices": {
   "A": "Amazon QuickSight, connected to Redshift and to Athena over S3, using row-level security rules.",
   "B": "An Amazon EC2 instance running an open-source BI tool behind an Application Load Balancer.",
   "C": "Amazon Athena's console, with each user running their own SQL.",
   "D": "Amazon S3 static website hosting with exported CSV files."
  },
  "answer": [
   "A"
  ],
  "explanation": "QuickSight is the managed BI service: it connects natively to Redshift and to Athena over S3, supports dashboards for non-technical users and enforces row-level security through a rules dataset — no servers for the data team. A self-hosted BI tool on EC2 (option B) is infrastructure the team explicitly does not want. The Athena console (option C) expects users to write SQL and has no dashboarding. Exported CSVs on a static site (option D) are stale, ungoverned and unfiltered."
 },
 {
  "id": "dea-140",
  "source": "authored",
  "domain": 3,
  "topic": "Glue job cost and DPU tuning",
  "difficulty": "hard",
  "multi": true,
  "question": "A Glue Spark job runs with 100 G.1X workers. CloudWatch metrics show the number of active executors is consistently around 20 and CPU utilisation stays below 15 percent. Which TWO actions reduce cost without materially increasing run time?",
  "choices": {
   "A": "Reduce the configured worker count to roughly match the executors the job actually uses.",
   "B": "Enable Glue auto scaling so the job requests only the executors it needs for each run.",
   "C": "Switch to G.2X workers while keeping the count at 100.",
   "D": "Increase the number of shuffle partitions to 10,000 so more executors become active.",
   "E": "Enable job bookmarks so subsequent runs read less data."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Paying for 100 workers when the job's parallelism supports about 20 is straightforward waste: right-sizing the worker count, or letting auto scaling request capacity per run, cuts DPU-hours while leaving the effective parallelism untouched. G.2X workers at the same count (option C) roughly doubles the cost. Forcing 10,000 shuffle partitions (option D) creates tiny tasks and scheduling overhead rather than useful parallelism. Bookmarks (option E) change the input volume, which is a valid optimisation in general but does not address paying for idle executors."
 },
 {
  "id": "dea-141",
  "source": "authored",
  "domain": 3,
  "topic": "CloudWatch composite alarms",
  "difficulty": "medium",
  "multi": false,
  "question": "During a pipeline incident the on-call engineer received 40 separate CloudWatch alarm notifications for one underlying failure. The team wants a single actionable page while keeping the individual alarms for diagnosis. What should they implement?",
  "choices": {
   "A": "Create a composite alarm that combines the individual alarms with a rule expression and notify only on the composite alarm.",
   "B": "Delete the redundant alarms and keep only the one closest to the root cause.",
   "C": "Increase every alarm's evaluation periods so fewer of them fire.",
   "D": "Route all alarm notifications into an SQS queue and have the engineer poll it."
  },
  "answer": [
   "A"
  ],
  "explanation": "Composite alarms evaluate a boolean expression over other alarms and can suppress child notifications, so the team pages once on the composite while the individual alarms remain visible for diagnosis — precisely the stated goal. Deleting alarms (option B) loses diagnostic signal. Longer evaluation periods (option C) delay every alert without reducing their number. Queuing notifications (option D) hides the page rather than consolidating it."
 },
 {
  "id": "dea-142",
  "source": "authored",
  "domain": 3,
  "topic": "CloudWatch metric filters",
  "difficulty": "medium",
  "multi": false,
  "question": "An application writes a structured log line containing a records_rejected count on every batch. The team wants to alarm when rejections exceed 1,000 in five minutes, without running a query manually. What should they configure?",
  "choices": {
   "A": "A CloudWatch Logs metric filter that extracts records_rejected into a custom metric, with a CloudWatch alarm on the sum over five minutes.",
   "B": "A scheduled CloudWatch Logs Insights query that emails the result.",
   "C": "A CloudTrail trail filtered to the application's log group.",
   "D": "An S3 export of the log group with an Athena query on a schedule."
  },
  "answer": [
   "A"
  ],
  "explanation": "A metric filter turns matching log content into a CloudWatch metric as the logs arrive, and an ordinary alarm on that metric's five-minute sum gives automatic alerting with no query to run. A scheduled Insights query (option B) is periodic, needs custom delivery and does not integrate with alarm actions. CloudTrail (option C) records API activity, not application log contents. Exporting to S3 and querying with Athena (option D) adds latency and infrastructure for something the log group can emit natively."
 },
 {
  "id": "dea-143",
  "source": "authored",
  "domain": 3,
  "topic": "Redshift system views",
  "difficulty": "hard",
  "multi": false,
  "question": "An engineer must identify which Redshift queries in the last day scanned the most data and how long each spent queued versus executing. Which sources give that detail?",
  "choices": {
   "A": "Query the Redshift system monitoring views such as SYS_QUERY_HISTORY and the related SVL and STL views that record execution, queue time and scan statistics.",
   "B": "Read the Redshift cluster's CloudWatch metrics for CPUUtilization and DatabaseConnections.",
   "C": "Enable CloudTrail data events for the cluster and analyse the API calls.",
   "D": "Inspect the Redshift audit log's connection log file in Amazon S3."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift exposes per-query execution detail in its system views — SYS_QUERY_HISTORY on recent provisioned and serverless workloads, plus the STL and SVL views — including queue time, execution time and rows or blocks scanned. Cluster CloudWatch metrics (option B) are aggregate and cannot attribute usage to a query. CloudTrail (option C) records control-plane calls, not SQL execution statistics. The audit connection log (option D) records logins and disconnections; the user activity log holds statement text but not execution statistics."
 },
 {
  "id": "dea-144",
  "source": "authored",
  "domain": 3,
  "topic": "EventBridge archive and replay",
  "difficulty": "medium",
  "multi": false,
  "question": "A downstream consumer of an EventBridge event bus was misconfigured for six hours and dropped every event it received. The team must reprocess exactly those events once the consumer is fixed. Which capability supports this?",
  "choices": {
   "A": "An EventBridge archive on the bus, then a replay of the archived events for the affected time window to the fixed target.",
   "B": "CloudTrail event history, exported and re-published manually.",
   "C": "The dead-letter queue on the rule, which retains events that targets rejected successfully.",
   "D": "EventBridge Scheduler, configured with a one-time schedule for the same window."
  },
  "answer": [
   "A"
  ],
  "explanation": "EventBridge archives retain events published to a bus, and a replay re-emits them for a chosen time window to specified rules — the intended mechanism for reprocessing after a consumer defect. CloudTrail (option B) records API activity, not the event payloads on a custom bus, and manual republication would be lossy. A dead-letter queue (option C) captures events the target failed to accept; here the target accepted them and discarded them itself. Scheduler (option D) creates new invocations without the original event payloads."
 },
 {
  "id": "dea-145",
  "source": "authored",
  "domain": 3,
  "topic": "MWAA monitoring",
  "difficulty": "medium",
  "multi": false,
  "question": "Tasks in an Amazon MWAA environment are being queued for long periods and DAG runs finish late. Which signals should the team examine to decide whether to change the environment size or worker configuration?",
  "choices": {
   "A": "The Airflow task queue depth and worker metrics published to CloudWatch, together with the scheduler and worker logs from the environment's log groups.",
   "B": "The Amazon S3 request metrics for the DAGs bucket.",
   "C": "AWS Health Dashboard notifications for the Region.",
   "D": "The CloudTrail record of CreateEnvironment calls."
  },
  "answer": [
   "A"
  ],
  "explanation": "MWAA publishes Airflow metrics to CloudWatch — including queued task counts and worker activity — and streams scheduler, worker, web server and task logs to log groups, which together show whether workers are saturated or the scheduler is the constraint. S3 request metrics on the DAGs bucket (option B) reflect DAG file access, not scheduling capacity. Regional health notices (option C) would explain an outage, not chronic queuing. CloudTrail creation records (option D) say nothing about runtime behaviour."
 },
 {
  "id": "dea-146",
  "source": "authored",
  "domain": 3,
  "topic": "Lambda throttling diagnosis",
  "difficulty": "medium",
  "multi": false,
  "question": "During peak load, an ingestion Lambda function shows a rising Throttles metric while its Duration and Errors are normal. What is the most likely cause and the appropriate fix?",
  "choices": {
   "A": "Invocations exceed the available concurrency, so the team should raise the account concurrency quota or the function's reserved concurrency, and confirm no other function is consuming the pool.",
   "B": "The function's memory setting is too low, so it should be increased.",
   "C": "The function's timeout is too short, so it should be extended.",
   "D": "The deployment package is too large, so it should be moved to a container image."
  },
  "answer": [
   "A"
  ],
  "explanation": "Throttles count invocations rejected because no concurrency was available, and normal duration and error metrics confirm the executing invocations are healthy — so the constraint is the concurrency pool, addressed by a quota increase, reserved concurrency for this function, or reining in a neighbouring function that is consuming the shared pool. Memory (option B) and timeout (option C) affect duration and timeout errors, neither of which is elevated. Package size (option D) influences cold start, not throttling."
 },
 {
  "id": "dea-147",
  "source": "authored",
  "domain": 3,
  "topic": "Cost optimisation for Athena",
  "difficulty": "medium",
  "multi": false,
  "question": "Athena spend is dominated by a handful of dashboards that re-run identical queries every few minutes over data that changes hourly. Which change most reduces cost with the least disruption?",
  "choices": {
   "A": "Enable query result reuse on the workgroup with a maximum age aligned to the hourly data refresh, so repeated identical queries return cached results without rescanning.",
   "B": "Increase the per-query data scan limit so queries stop failing and retrying.",
   "C": "Move the dashboards from Athena to a provisioned Redshift cluster.",
   "D": "Convert the tables from Parquet to JSON to simplify the queries."
  },
  "answer": [
   "A"
  ],
  "explanation": "Result reuse returns a previous result for an identical query within a configured age, so dashboards refreshing every few minutes over hourly data stop paying to rescan the same bytes — a workgroup setting with no query changes. Raising the scan limit (option B) removes a guardrail and increases spend. Migrating to Redshift (option C) is a large change that trades scan cost for continuous cluster cost. JSON (option D) would multiply bytes scanned."
 },
 {
  "id": "dea-148",
  "source": "authored",
  "domain": 3,
  "topic": "Crawler failures and misclassification",
  "difficulty": "medium",
  "multi": false,
  "question": "A Glue crawler over a prefix of pipe-delimited text files creates a table with a single column containing the whole line. What should the team do so the columns are recognised correctly?",
  "choices": {
   "A": "Add a custom CSV classifier specifying the pipe delimiter and quote character, attach it to the crawler and rerun it.",
   "B": "Change the crawler's IAM role to allow s3:GetObjectVersion.",
   "C": "Enable the crawler's option to create a single schema for the S3 path.",
   "D": "Convert the files to Parquet with a Glue job before crawling."
  },
  "answer": [
   "A"
  ],
  "explanation": "Built-in classifiers recognise common delimiters, and when they do not match the file the crawler falls back to treating each line as one field; a custom CSV classifier declaring the pipe delimiter and quoting rules makes the crawler parse the columns properly. Additional S3 permissions (option B) would surface as an access error, not a one-column table. Single-schema grouping (option C) merges tables, a different problem. Converting to Parquet first (option D) requires already knowing the schema — the very thing that is failing."
 },
 {
  "id": "dea-149",
  "source": "authored",
  "domain": 3,
  "topic": "Backfill without disrupting daily runs",
  "difficulty": "hard",
  "multi": false,
  "question": "A team must backfill 18 months of a daily pipeline. The daily run must keep meeting its SLA, and the backfill must not exhaust shared Glue capacity. What is the best operational approach?",
  "choices": {
   "A": "Run the backfill as a separate parameterised execution with bounded concurrency — for example a Step Functions Map state with a maximum concurrency — scheduled outside the daily window and using its own capacity limits.",
   "B": "Trigger 540 concurrent Glue job runs so the backfill finishes as quickly as possible.",
   "C": "Pause the daily pipeline until the backfill completes, then resume it.",
   "D": "Modify the daily job to process one extra historical day per run for the next 18 months."
  },
  "answer": [
   "A"
  ],
  "explanation": "A bounded-concurrency backfill isolates the historical work from the daily path: a Map state with a concurrency cap paces the runs, parameterisation keeps one job definition, and scheduling it outside the daily window protects the SLA. Launching 540 concurrent runs (option B) will hit account limits and starve the daily job. Pausing the daily pipeline (option C) breaks the SLA outright. Piggybacking one day per run (option D) takes 18 months to complete and couples the two workloads."
 },
 {
  "id": "dea-150",
  "source": "authored",
  "domain": 3,
  "topic": "Data lineage and impact analysis",
  "difficulty": "medium",
  "multi": false,
  "question": "Before changing the schema of a widely used curated table, a team needs to know which downstream jobs, queries and dashboards depend on it. Which combination gives the most reliable answer?",
  "choices": {
   "A": "Combine catalog and query history evidence — Athena and Redshift query history for who reads the table, CloudTrail for API access, and a business catalog such as Amazon DataZone or a lineage tool for documented consumers.",
   "B": "Ask teams on a company chat channel and act on the replies received within a day.",
   "C": "Rename the table and see which pipelines fail.",
   "D": "Inspect the S3 prefix's Storage Lens metrics for read activity."
  },
  "answer": [
   "A"
  ],
  "explanation": "Reliable impact analysis triangulates observed access — query history in Athena and Redshift, CloudTrail records of who called what — with documented lineage in a catalog, because either source alone misses consumers. Asking in chat (option B) captures only those who see the message and remember. Renaming to see what breaks (option C) is an outage disguised as a test. Storage Lens (option D) reports storage-level metrics without identifying which job or dashboard read the data."
 },
 {
  "id": "dea-151",
  "source": "authored",
  "domain": 3,
  "topic": "Log retention cost",
  "difficulty": "easy",
  "multi": false,
  "question": "CloudWatch Logs charges have grown steadily because every log group defaults to never expire, though the team only investigates incidents within 30 days and archives beyond that are needed for a year. What should they configure?",
  "choices": {
   "A": "Set a 30-day retention policy on the log groups and export or subscribe the logs to Amazon S3 with a lifecycle rule for the one-year archive.",
   "B": "Delete the log groups quarterly and let them be recreated.",
   "C": "Reduce the application's log level to error only.",
   "D": "Move the log groups to a different Region with lower pricing."
  },
  "answer": [
   "A"
  ],
  "explanation": "Retention policies stop CloudWatch storing logs indefinitely, and a subscription or export to S3 with lifecycle rules keeps the year-long archive at a fraction of the cost while remaining queryable with Athena. Deleting log groups (option B) destroys the archive and loses in-flight data. Cutting log verbosity (option C) saves money but discards the diagnostic detail incidents need. Region shopping (option D) complicates operations for marginal savings and does not address unbounded retention."
 },
 {
  "id": "dea-152",
  "source": "authored",
  "domain": 3,
  "topic": "EMR managed scaling",
  "difficulty": "medium",
  "multi": false,
  "question": "A long-running EMR cluster serves a workload whose demand varies through the day. The team wants the cluster to add and remove capacity automatically based on YARN demand, with minimal tuning of scaling rules. What should they enable?",
  "choices": {
   "A": "EMR managed scaling, with minimum and maximum capacity limits set on the cluster.",
   "B": "Custom automatic scaling policies with CloudWatch alarms on YARNMemoryAvailablePercentage for each instance group.",
   "C": "A scheduled resize that doubles the task instance group each morning and halves it each evening.",
   "D": "Instance fleets with an allocation strategy but a fixed target capacity."
  },
  "answer": [
   "A"
  ],
  "explanation": "Managed scaling continuously evaluates YARN metrics and resizes core and task capacity within configured limits, with no scaling rules to author or tune — the lowest-effort option that reacts to real demand. Custom scaling policies (option B) do work but require alarms, thresholds and cooldowns to be tuned per instance group. Scheduled resizes (option C) follow the clock rather than demand. Fleets with a fixed target capacity (option D) improve provisioning resilience without scaling at all."
 },
 {
  "id": "dea-153",
  "source": "authored",
  "domain": 3,
  "topic": "Dead-letter queue operations",
  "difficulty": "medium",
  "multi": false,
  "question": "Messages have accumulated in the dead-letter queue of a processing pipeline after a downstream outage that is now resolved. The team must reprocess them safely and know if the problem recurs. What should they do?",
  "choices": {
   "A": "Use the SQS dead-letter queue redrive to move the messages back to the source queue, and add a CloudWatch alarm on ApproximateNumberOfMessagesVisible on the DLQ.",
   "B": "Purge the dead-letter queue and ask producers to resend the affected records.",
   "C": "Increase the source queue's maxReceiveCount so messages stop reaching the DLQ.",
   "D": "Subscribe the DLQ to an SNS topic so the messages are emailed to the team."
  },
  "answer": [
   "A"
  ],
  "explanation": "DLQ redrive is the built-in way to return messages to the source queue for reprocessing once the downstream fault is fixed, and an alarm on the DLQ's visible message count gives early warning if the failure returns. Purging (option B) discards data and assumes producers can replay, which is often untrue. Raising maxReceiveCount (option C) hides failures by retrying them forever in the main queue. Emailing message bodies (option D) neither reprocesses them nor scales."
 },
 {
  "id": "dea-154",
  "source": "authored",
  "domain": 3,
  "topic": "Redshift Advisor and rightsizing",
  "difficulty": "easy",
  "multi": false,
  "question": "A team wants AWS-generated, workload-specific recommendations about their Redshift cluster — such as tables that would benefit from different keys, or unused capacity. Where should they look first?",
  "choices": {
   "A": "Amazon Redshift Advisor in the Redshift console, which analyses cluster usage and suggests specific changes.",
   "B": "AWS Trusted Advisor's service limits category.",
   "C": "AWS Compute Optimizer's EC2 recommendations.",
   "D": "AWS Cost Anomaly Detection."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift Advisor analyses the cluster's own workload and produces targeted recommendations on table design, compression, snapshot settings and capacity. Trusted Advisor's service limits checks (option B) report quota headroom, not Redshift table design. Compute Optimizer (option C) rightsizes EC2, EBS, Lambda and similar resources, not Redshift internals. Cost Anomaly Detection (option D) flags unusual spend without explaining cluster configuration."
 },
 {
  "id": "dea-155",
  "source": "authored",
  "domain": 3,
  "topic": "Cross-account observability",
  "difficulty": "medium",
  "multi": false,
  "question": "A platform team must build one dashboard showing pipeline health across twelve AWS accounts without copying metrics or granting broad console access in every account. Which approach fits best?",
  "choices": {
   "A": "Use CloudWatch cross-account observability, linking source accounts to a monitoring account so its dashboards can read metrics, logs and traces centrally.",
   "B": "Create an IAM user in each account and switch between them when investigating.",
   "C": "Publish custom metrics from every account into a single account with a Lambda function on a schedule.",
   "D": "Export each account's metrics to Amazon S3 nightly and build an Athena dashboard."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudWatch cross-account observability is designed for this: source accounts share metrics, logs and traces with a designated monitoring account, which builds unified dashboards with no data copying and no per-account console access. Per-account IAM users (option B) defeat the point of one dashboard. A custom metric-forwarding Lambda (option C) rebuilds the feature with lag and cost. Nightly S3 exports (option D) give stale data unsuited to health monitoring."
 },
 {
  "id": "dea-156",
  "source": "authored",
  "domain": 3,
  "topic": "Athena engine and workgroup upgrades",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants to adopt a newer Athena engine version for better performance but is worried about SQL behaviour changes breaking scheduled reports. What is the safest way to proceed?",
  "choices": {
   "A": "Create a separate workgroup pinned to the new engine version, run the existing report queries there and compare results before switching the production workgroup.",
   "B": "Switch the production workgroup to automatic engine upgrades and fix reports as issues appear.",
   "C": "Rewrite every query to avoid functions whose behaviour might change.",
   "D": "Keep the current engine version indefinitely and disable upgrades."
  },
  "answer": [
   "A"
  ],
  "explanation": "Engine version is a workgroup setting, so a parallel workgroup on the new version gives a genuine side-by-side test of the real queries against the real data before anything in production changes. Automatic upgrades with reactive fixes (option B) discovers breakage through failed reports. Speculative rewriting (option C) is guesswork without a test. Freezing the engine forever (option D) forgoes performance gains and eventually forces a much larger jump."
 },
 {
  "id": "dea-157",
  "source": "authored",
  "domain": 3,
  "topic": "Tracing a multi-service pipeline",
  "difficulty": "hard",
  "multi": false,
  "question": "An event takes an unpredictable amount of time to travel through API Gateway, Lambda, SQS and a second Lambda. The team needs to see where the time goes for individual events, across services. Which tool provides this?",
  "choices": {
   "A": "AWS X-Ray tracing enabled across the services, so each request produces a trace with per-segment timing.",
   "B": "CloudWatch metrics for each service's average duration.",
   "C": "CloudTrail logs correlated by event time.",
   "D": "VPC Flow Logs for the subnets involved."
  },
  "answer": [
   "A"
  ],
  "explanation": "X-Ray propagates a trace ID across supported services and records segments and subsegments, so a single event's journey is visible with timing at each hop — the definition of distributed tracing. Service-level average duration metrics (option B) hide per-request variation and cannot be correlated across hops. CloudTrail (option C) records API calls without latency breakdown per request path. Flow logs (option D) capture network-level metadata, not application timing."
 },
 {
  "id": "dea-158",
  "source": "authored",
  "domain": 3,
  "topic": "Compute purchase options",
  "difficulty": "medium",
  "multi": false,
  "question": "An analytics platform runs a steady baseline of EMR and EC2 compute 24 hours a day, plus unpredictable bursts. The finance team wants to reduce cost without risking capacity for the baseline. Which strategy is appropriate?",
  "choices": {
   "A": "Cover the steady baseline with Compute Savings Plans or Reserved Instances and serve the bursts with On-Demand and Spot capacity.",
   "B": "Run everything on Spot Instances to minimise the hourly rate.",
   "C": "Run everything On-Demand and rely on Cost Anomaly Detection to catch overspend.",
   "D": "Purchase Savings Plans to cover the peak of the burst traffic."
  },
  "answer": [
   "A"
  ],
  "explanation": "The standard pattern is to commit only to the predictable floor — Savings Plans or Reserved Instances for the always-on baseline — and use On-Demand and interruption-tolerant Spot for variable bursts, which captures the discount without committing to capacity that may not be used. All-Spot (option B) risks interruption of the baseline workload. All On-Demand (option C) forgoes a large, low-risk discount. Committing at peak (option D) buys commitment that goes unused most of the time."
 },
 {
  "id": "dea-159",
  "source": "authored",
  "domain": 3,
  "topic": "Retry storms and backpressure",
  "difficulty": "hard",
  "multi": false,
  "question": "When a downstream API slows down, a pipeline's aggressive retries multiply the load and turn a partial degradation into a total outage. Which combination of client behaviours prevents this?",
  "choices": {
   "A": "Exponential backoff with jitter, a bounded retry count, and a circuit breaker that stops calling the dependency while it is unhealthy.",
   "B": "Immediate retries with a fixed one-second interval and unlimited attempts.",
   "C": "Increasing the client timeout so slow calls eventually succeed.",
   "D": "Adding more concurrent workers so the backlog is cleared faster."
  },
  "answer": [
   "A"
  ],
  "explanation": "Backoff spreads retries over time, jitter prevents synchronised retry waves across clients, a retry cap stops infinite amplification, and a circuit breaker sheds load entirely while the dependency recovers — together they turn a retry storm back into a degradation. Fixed-interval unlimited retries (option B) are the storm. Longer timeouts (option C) hold more concurrent connections open, worsening saturation. More workers (option D) increases the offered load against an already struggling dependency."
 },
 {
  "id": "dea-160",
  "source": "authored",
  "domain": 3,
  "topic": "Alarm design for pipelines",
  "difficulty": "medium",
  "multi": true,
  "question": "A team is designing alerting for a critical data pipeline. Which TWO practices best reduce alert fatigue while keeping real incidents visible?",
  "choices": {
   "A": "Alarm on symptoms that matter to consumers, such as data freshness and completeness, rather than on every internal component metric.",
   "B": "Route informational alarms to a dashboard or ticket queue and page only for alarms that require immediate human action.",
   "C": "Set every alarm to a single evaluation period so problems are caught as early as possible.",
   "D": "Page the whole team on every alarm so nothing is missed.",
   "E": "Disable alarms during business hours when engineers are already watching dashboards."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Alerting on consumer-visible symptoms keeps the alarm count proportional to real impact rather than to component count, and separating paging alarms from informational ones means a page always implies action is required. A single evaluation period everywhere (option C) maximises false positives from transient spikes. Paging everyone for everything (option D) is the definition of alert fatigue. Disabling alarms during the day (option E) removes coverage exactly when most changes are deployed."
 },
 {
  "id": "dea-161",
  "source": "authored",
  "domain": 3,
  "topic": "QuickSight SPICE refresh",
  "difficulty": "medium",
  "multi": false,
  "question": "A QuickSight dashboard backed by a SPICE dataset shows data that is up to a day stale, and users need it refreshed hourly during business hours. The underlying Athena table is updated every hour. What should be configured?",
  "choices": {
   "A": "An hourly incremental refresh schedule on the SPICE dataset, using a lookback window over the updated partitions.",
   "B": "Switch the dataset to direct query so every visual queries Athena on each render.",
   "C": "Ask users to click the refresh icon on the dashboard when they need current data.",
   "D": "Rebuild the dashboard as an emailed report sent hourly."
  },
  "answer": [
   "A"
  ],
  "explanation": "SPICE datasets refresh on a schedule, and incremental refresh over a lookback window updates only recent data, so an hourly schedule matches the source cadence while keeping SPICE's fast in-memory performance. Direct query (option B) does deliver current data but sends every visual's query to Athena, raising cost and latency for a dashboard that only needs hourly accuracy. A manual refresh button (option C) is not a schedule and SPICE refreshes are not instant. An emailed report (option D) abandons the interactive dashboard."
 },
 {
  "id": "dea-162",
  "source": "authored",
  "domain": 3,
  "topic": "Missing S3 event triggers",
  "difficulty": "hard",
  "multi": false,
  "question": "A pipeline triggered by S3 event notifications occasionally misses files. Investigation shows the notification target briefly failed during a deployment. What design change makes the trigger path more resilient?",
  "choices": {
   "A": "Deliver S3 events to an SQS queue that the consumer polls, so events are retained and retried if the consumer is unavailable, with a dead-letter queue for poison messages.",
   "B": "Increase the S3 event notification retry count in the bucket configuration.",
   "C": "Have the consumer list the bucket every minute instead of relying on events.",
   "D": "Enable S3 Versioning so events are re-emitted for each version."
  },
  "answer": [
   "A"
  ],
  "explanation": "Putting a durable queue between S3 and the consumer decouples them: events persist in SQS while the consumer is down, are redelivered when it returns, and problem messages land in a dead-letter queue. There is no configurable notification retry count in the bucket configuration (option B). Listing every minute (option C) replaces events with polling that is slow and expensive on a large bucket. Versioning (option D) does not re-emit events for a failed delivery."
 },
 {
  "id": "dea-163",
  "source": "authored",
  "domain": 3,
  "topic": "Glue job retries and timeouts",
  "difficulty": "easy",
  "multi": false,
  "question": "A Glue job occasionally hangs and runs for hours before someone notices, and transient failures require manual reruns. Which job settings address both problems?",
  "choices": {
   "A": "Set an explicit job timeout appropriate to normal run duration and configure a small number of automatic retries.",
   "B": "Increase the worker count so runs finish before anyone notices a problem.",
   "C": "Enable continuous logging so hangs appear in CloudWatch.",
   "D": "Schedule the job more frequently so a hung run is superseded."
  },
  "answer": [
   "A"
  ],
  "explanation": "A job timeout bounds a hung run so it fails rather than burning DPU-hours indefinitely, and a modest retry count handles transient failures without human intervention — both are first-class job properties. More workers (option B) does not bound a hang. Continuous logging (option C) improves visibility after the fact but stops nothing. Running more often (option D) risks overlapping runs and compounds the waste."
 },
 {
  "id": "dea-164",
  "source": "authored",
  "domain": 3,
  "topic": "Concurrency scaling cost control",
  "difficulty": "medium",
  "multi": false,
  "question": "After enabling Redshift concurrency scaling, the monthly bill rose sharply. The team wants to keep the burst capability but bound its cost. What should they configure?",
  "choices": {
   "A": "Set a usage limit for concurrency scaling on the cluster with an action such as alert, log or disable when the configured hours are exceeded.",
   "B": "Disable concurrency scaling entirely and add permanent nodes instead.",
   "C": "Lower the WLM concurrency so fewer queries qualify for scaling.",
   "D": "Move the workload to Redshift Serverless."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift usage limits are designed precisely for this: a monthly limit on concurrency scaling hours with an action to alert, log or turn the feature off keeps the burst capability while capping its cost. Disabling it and adding nodes (option B) pays for peak capacity permanently. Reducing WLM concurrency (option C) changes queuing behaviour indirectly and unpredictably. Migrating to Serverless (option D) is a much larger change and has its own capacity limits to configure."
 },
 {
  "id": "dea-165",
  "source": "authored",
  "domain": 4,
  "topic": "Lake Formation column-level security",
  "difficulty": "medium",
  "multi": false,
  "question": "Analysts must query a customer table but must not see the ssn and date_of_birth columns, while the fraud team sees everything. The same table must serve both groups through Athena without duplicating data. Which approach is best?",
  "choices": {
   "A": "Register the table with AWS Lake Formation and grant column-level SELECT permissions, excluding the sensitive columns for the analyst principals.",
   "B": "Create a second copy of the table with the sensitive columns removed and grant analysts access to that copy.",
   "C": "Create an Athena view that omits the sensitive columns and grant analysts access to the view's S3 prefix.",
   "D": "Add an IAM policy condition on the analysts' role denying access to the sensitive column names."
  },
  "answer": [
   "A"
  ],
  "explanation": "Lake Formation enforces fine-grained permissions on catalog resources, including column-level grants applied when Athena reads the table, so one physical table serves both audiences with different visible columns. A filtered copy (option B) duplicates data and storage and drifts from the original. A view (option C) helps only if underlying S3 access is blocked, and granting the analysts access to the S3 prefix does exactly the opposite. IAM policies (option D) act on API operations and S3 objects and cannot express column-level SQL restrictions."
 },
 {
  "id": "dea-166",
  "source": "authored",
  "domain": 4,
  "topic": "Lake Formation row-level filters",
  "difficulty": "hard",
  "multi": false,
  "question": "A shared sales table must show each regional manager only the rows for their own region, using one table and one set of dashboards. Which mechanism enforces this at the data lake layer?",
  "choices": {
   "A": "A Lake Formation data filter with a row filter expression on the region column, granted per principal.",
   "B": "Separate S3 prefixes per region with bucket policies granting each manager their prefix.",
   "C": "An Athena workgroup per manager with a query result location per region.",
   "D": "A QuickSight dashboard filter set to the manager's region by default."
  },
  "answer": [
   "A"
  ],
  "explanation": "Lake Formation data filters express row-level predicates — plus optional column restrictions — that are enforced whenever a granted principal queries the table through an integrated engine, so one table and one dashboard serve everyone correctly. Per-region prefixes with bucket policies (option B) fragment the table and lose the single-table requirement. Workgroups (option C) govern query settings and cost, not row visibility. A dashboard default filter (option D) is a presentation convenience that any user can change."
 },
 {
  "id": "dea-167",
  "source": "authored",
  "domain": 4,
  "topic": "Encryption key management",
  "difficulty": "medium",
  "multi": false,
  "question": "A compliance rule requires that the company be able to revoke access to a dataset's ciphertext immediately and prove key usage in audit logs. Which encryption configuration meets this for data in Amazon S3?",
  "choices": {
   "A": "Server-side encryption with a customer managed AWS KMS key, whose key policy controls access and whose use is recorded in AWS CloudTrail.",
   "B": "Server-side encryption with Amazon S3 managed keys (SSE-S3).",
   "C": "Client-side encryption with a static key embedded in the application configuration.",
   "D": "Server-side encryption with an AWS managed key for S3."
  },
  "answer": [
   "A"
  ],
  "explanation": "A customer managed KMS key gives the company control of the key policy — so access can be revoked or the key disabled immediately — and every Decrypt and GenerateDataKey call is logged in CloudTrail for audit. SSE-S3 (option B) uses keys the customer cannot govern or audit individually. A static embedded key (option C) cannot be revoked without redeploying and leaves no usage trail. AWS managed keys (option D) have policies that customers cannot edit, so access cannot be revoked in the way required."
 },
 {
  "id": "dea-168",
  "source": "authored",
  "domain": 4,
  "topic": "PII discovery",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team must discover which existing S3 buckets contain personal data such as credit card numbers and national identifiers, without writing detection logic. Which service should they use?",
  "choices": {
   "A": "Amazon Macie, which scans S3 objects for sensitive data using managed and custom data identifiers.",
   "B": "Amazon GuardDuty, which analyses account activity for threats.",
   "C": "AWS Config, with a rule checking bucket contents.",
   "D": "Amazon Inspector, which scans workloads for software vulnerabilities."
  },
  "answer": [
   "A"
  ],
  "explanation": "Macie is the managed sensitive-data discovery service for S3: it inventories buckets and uses managed identifiers for common PII types plus custom identifiers for company-specific formats. GuardDuty (option B) detects suspicious activity from logs and does not inspect object contents for PII. AWS Config (option C) evaluates resource configuration, not object contents. Inspector (option D) finds vulnerabilities in compute workloads and container images."
 },
 {
  "id": "dea-169",
  "source": "authored",
  "domain": 4,
  "topic": "Masking PII during ingestion",
  "difficulty": "medium",
  "multi": false,
  "question": "A pipeline must ensure that email addresses and phone numbers never reach the analytics zone in clear text, while preserving the ability to join records on the masked values. Which approach is most appropriate?",
  "choices": {
   "A": "Apply deterministic tokenisation or a keyed hash to those fields during the transformation stage, so equal inputs produce equal tokens and the original values stay out of the analytics zone.",
   "B": "Encrypt the whole file with AWS KMS before writing it to the analytics zone.",
   "C": "Redact the fields by replacing every value with a constant string.",
   "D": "Grant analysts read access only during business hours."
  },
  "answer": [
   "A"
  ],
  "explanation": "Deterministic tokenisation or a keyed hash removes the clear-text value while preserving equality, so joins and counts by user still work — exactly the stated combination of requirements. Whole-file encryption (option B) makes the data unusable for analytics unless it is decrypted, which puts the clear text back. A constant redaction value (option C) destroys the join key. Time-based access control (option D) governs when the clear text is readable, not whether it is present."
 },
 {
  "id": "dea-170",
  "source": "authored",
  "domain": 4,
  "topic": "Private connectivity to AWS services",
  "difficulty": "medium",
  "multi": false,
  "question": "A security requirement states that traffic from Glue jobs in private subnets to Amazon S3 and AWS KMS must not traverse the public internet, and access must be restricted to specific buckets. Which configuration meets this?",
  "choices": {
   "A": "Create a gateway VPC endpoint for Amazon S3 and an interface VPC endpoint for AWS KMS, and attach endpoint policies restricting access to the approved buckets and keys.",
   "B": "Route the subnets through a NAT gateway and restrict the outbound security group to the AWS service IP ranges.",
   "C": "Enable S3 Block Public Access on the buckets and rely on IAM policies.",
   "D": "Place the Glue jobs in public subnets with Elastic IP addresses so traffic is direct."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC endpoints keep traffic on the AWS network — a gateway endpoint for S3 and an interface endpoint for KMS — and endpoint policies restrict which buckets and keys can be reached through them, satisfying both the network and the scoping requirement. A NAT gateway (option B) sends traffic over the public internet path by definition. Block Public Access (option C) prevents public exposure of the bucket but does not change the network path of outbound calls. Public subnets with Elastic IPs (option D) is the opposite of the requirement."
 },
 {
  "id": "dea-171",
  "source": "authored",
  "domain": 4,
  "topic": "Least privilege for pipeline roles",
  "difficulty": "medium",
  "multi": false,
  "question": "A Glue job role currently has s3:* on all resources. The team must reduce it to least privilege without breaking the job. What is the most reliable way to determine the required permissions?",
  "choices": {
   "A": "Use IAM Access Analyzer policy generation based on the role's CloudTrail activity, then scope the resulting policy to the specific buckets, prefixes and actions the job actually used.",
   "B": "Remove permissions one at a time in production and see what fails.",
   "C": "Replace s3:* with s3:Get* and s3:Put* on all resources.",
   "D": "Attach the ReadOnlyAccess AWS managed policy in addition to the current policy."
  },
  "answer": [
   "A"
  ],
  "explanation": "Access Analyzer can generate a policy from the role's recorded CloudTrail activity, giving an evidence-based starting point that is then narrowed to the exact buckets and prefixes — the standard path to least privilege without guesswork. Trial-and-error removal in production (option B) causes outages to gather the same information. Broadening to s3:Get* and s3:Put* on all resources (option C) still grants access to every bucket in the account. Adding ReadOnlyAccess (option D) widens permissions rather than narrowing them."
 },
 {
  "id": "dea-172",
  "source": "authored",
  "domain": 4,
  "topic": "Redshift dynamic data masking",
  "difficulty": "hard",
  "multi": false,
  "question": "In Amazon Redshift, support staff must see only the last four digits of a card number column, while the finance role sees the full value, using the same table and the same queries. Which feature provides this?",
  "choices": {
   "A": "Dynamic data masking policies attached to the column and granted per role, so the returned value depends on the querying principal.",
   "B": "A view that applies SUBSTRING for support staff, with the base table's permissions revoked from everyone.",
   "C": "Column-level GRANT statements that hide the column from support staff.",
   "D": "Encrypting the column with a KMS key and decrypting in the application."
  },
  "answer": [
   "A"
  ],
  "explanation": "Dynamic data masking applies a masking expression to a column and attaches it to specific roles, so the same query returns masked or full values depending on who runs it — the exact requirement of one table and one query. A view (option B) can work but requires different queries or objects per audience, which the requirement rules out. Column-level grants (option C) hide the column entirely rather than partially masking it. Application-side decryption (option D) moves the control outside the database and out of the SQL path."
 },
 {
  "id": "dea-173",
  "source": "authored",
  "domain": 4,
  "topic": "Secrets management and rotation",
  "difficulty": "medium",
  "multi": false,
  "question": "Database credentials used by several Glue jobs are currently stored as plaintext job parameters and have not been changed in two years. What should the team implement?",
  "choices": {
   "A": "Store the credentials in AWS Secrets Manager with automatic rotation enabled, and have the jobs retrieve them at runtime using the job role.",
   "B": "Move the credentials into environment variables on each job.",
   "C": "Store the credentials in an encrypted S3 object that the jobs download at startup.",
   "D": "Store the credentials in an SSM Parameter Store String parameter and change them manually each quarter."
  },
  "answer": [
   "A"
  ],
  "explanation": "Secrets Manager stores the credentials encrypted with KMS, controls retrieval through IAM, records access in CloudTrail and rotates them automatically with a rotation function — addressing both the exposure and the staleness. Environment variables (option B) keep the secret in configuration where it is readable and never rotated. An encrypted S3 object (option C) improves on plaintext but leaves rotation and access control to hand-built code. A plain String parameter (option D) is unencrypted and manually rotated at best."
 },
 {
  "id": "dea-174",
  "source": "authored",
  "domain": 4,
  "topic": "Cross-account data sharing with Lake Formation",
  "difficulty": "hard",
  "multi": false,
  "question": "A producer account owns lake tables that a consumer account's analysts must query with Athena, with permissions managed centrally and no data copying. Which approach is correct?",
  "choices": {
   "A": "Use Lake Formation cross-account grants — sharing the database or table with the consumer account, which then creates a resource link and grants its own principals access.",
   "B": "Make the S3 bucket public and share the table definition by email.",
   "C": "Copy the tables nightly into the consumer account with S3 Replication and a crawler.",
   "D": "Give the consumer account's analysts IAM roles in the producer account and have them work there."
  },
  "answer": [
   "A"
  ],
  "explanation": "Lake Formation supports cross-account sharing of catalog resources: the producer grants the consumer account access, the consumer creates a resource link and grants its analysts, and Lake Formation enforces the permissions when Athena reads the data — central control with no copies. A public bucket (option B) is an unacceptable exposure. Nightly replication (option C) creates copies and duplicates governance. Handing out roles in the producer account (option D) puts consumer users inside the producer's account and scales badly."
 },
 {
  "id": "dea-175",
  "source": "authored",
  "domain": 4,
  "topic": "Auditing data access",
  "difficulty": "medium",
  "multi": false,
  "question": "Auditors require evidence of every read of objects in a sensitive S3 prefix, including the principal and the time, retained for three years. What should be configured?",
  "choices": {
   "A": "A CloudTrail trail with S3 data events enabled for that prefix, delivered to a dedicated S3 bucket with a lifecycle policy and restricted access.",
   "B": "CloudTrail management events, which record every S3 GetObject call by default.",
   "C": "S3 server access logging alone, delivered to the same bucket.",
   "D": "Amazon Macie continuous discovery on the prefix."
  },
  "answer": [
   "A"
  ],
  "explanation": "Object-level reads are CloudTrail data events, which must be explicitly enabled and can be scoped to a prefix; delivering them to a dedicated, access-restricted bucket with a lifecycle policy meets the retention and integrity expectations of an audit. Management events (option B) do not include GetObject. Server access logs (option C) are best-effort and less structured, and writing them into the same bucket mixes audit data with the data being audited. Macie (option D) discovers sensitive content rather than recording access."
 },
 {
  "id": "dea-176",
  "source": "authored",
  "domain": 4,
  "topic": "Right to erasure in a data lake",
  "difficulty": "hard",
  "multi": false,
  "question": "A privacy regulation requires that a specific customer's personal data be deleted from the data lake on request. The lake stores immutable Parquet files in date partitions, and rewriting whole partitions on every request is impractical. Which design best supports erasure?",
  "choices": {
   "A": "Store personal attributes in a transactional table format such as Iceberg so a targeted DELETE removes the rows, or use crypto-shredding by encrypting each subject's data with a per-subject key that can be destroyed.",
   "B": "Add a deleted flag column and filter the rows out in every downstream query.",
   "C": "Move the affected partitions to S3 Glacier Deep Archive so the data is no longer accessible.",
   "D": "Rely on S3 Lifecycle expiration to remove the data eventually."
  },
  "answer": [
   "A"
  ],
  "explanation": "Erasure requires the data to actually stop being recoverable. A transactional table format supports row-level DELETE with a bounded rewrite, and crypto-shredding renders a subject's data unrecoverable by destroying their key — both are recognised patterns for this requirement. A soft-delete flag (option B) leaves the personal data present. Archiving (option C) changes storage class while retaining the data. Lifecycle expiration (option D) deletes on a schedule unrelated to the request and does not target the individual."
 },
 {
  "id": "dea-177",
  "source": "authored",
  "domain": 4,
  "topic": "Encryption in transit",
  "difficulty": "medium",
  "multi": false,
  "question": "A policy requires that all access to a data lake bucket use TLS, and that the requirement be enforced rather than assumed. What should be configured?",
  "choices": {
   "A": "A bucket policy that denies all actions when the aws:SecureTransport condition key is false.",
   "B": "Server-side encryption with SSE-KMS on the bucket.",
   "C": "S3 Block Public Access on the bucket and the account.",
   "D": "A VPC endpoint policy that allows only the analytics account."
  },
  "answer": [
   "A"
  ],
  "explanation": "Denying requests where aws:SecureTransport is false rejects any plaintext HTTP request at the bucket, which is enforcement rather than convention. SSE-KMS (option B) protects data at rest and says nothing about the transport. Block Public Access (option C) prevents public exposure but permits non-TLS requests from authorised principals. An endpoint policy scoped to an account (option D) restricts who can reach the bucket, not whether their connection is encrypted."
 },
 {
  "id": "dea-178",
  "source": "authored",
  "domain": 4,
  "topic": "Service control policies",
  "difficulty": "medium",
  "multi": false,
  "question": "An organisation must guarantee that no account in its data organisational unit can disable CloudTrail or delete audit log buckets, even if an account administrator tries. Which control provides this?",
  "choices": {
   "A": "A service control policy attached to the organisational unit denying the relevant CloudTrail and S3 actions, since SCPs bound the maximum permissions of every principal in those accounts.",
   "B": "An IAM permissions boundary attached to each account's administrator role.",
   "C": "An AWS Config rule that re-enables CloudTrail when it is turned off.",
   "D": "A bucket policy on the audit bucket denying deletes from unknown principals."
  },
  "answer": [
   "A"
  ],
  "explanation": "SCPs set the permission ceiling for every principal in the affected accounts, including their administrators and root user, so an explicit deny there cannot be overridden locally. Permissions boundaries (option B) apply only to the identities they are attached to and can be removed by another administrator in the account. A Config remediation rule (option C) reacts after the control has already been disabled. A bucket policy (option D) can be edited by a sufficiently privileged local principal and does not protect CloudTrail configuration."
 },
 {
  "id": "dea-179",
  "source": "authored",
  "domain": 4,
  "topic": "Athena result encryption and isolation",
  "difficulty": "medium",
  "multi": false,
  "question": "Query results written by Amazon Athena contain sensitive data and are currently stored unencrypted in a bucket that many teams can read. Which configuration fixes this centrally rather than relying on each analyst?",
  "choices": {
   "A": "Configure the workgroup to override client settings, with an encrypted query result location using SSE-KMS and a bucket policy limiting access to that team's principals.",
   "B": "Ask analysts to set an encrypted result location in their own console preferences.",
   "C": "Enable default encryption on the existing shared bucket and keep the current permissions.",
   "D": "Delete query results after 24 hours with a lifecycle rule."
  },
  "answer": [
   "A"
  ],
  "explanation": "Workgroup settings can enforce both the result location and its encryption and override whatever the client requests, so the control does not depend on individual behaviour; scoping the bucket policy limits who can read the results. Per-analyst preferences (option B) are exactly the unreliable arrangement being replaced. Default encryption on a widely readable bucket (option C) encrypts at rest while leaving broad read access to the plaintext through the API. A lifecycle rule (option D) shortens exposure without preventing it."
 },
 {
  "id": "dea-180",
  "source": "authored",
  "domain": 4,
  "topic": "Data classification and tagging",
  "difficulty": "medium",
  "multi": true,
  "question": "A company is introducing a data classification scheme across its lake. Which TWO practices make the classification operationally useful rather than merely documentary?",
  "choices": {
   "A": "Attach classification as Lake Formation LF-Tags on catalog resources and grant permissions by tag, so access rules follow the classification automatically.",
   "B": "Enforce classification-driven controls in policy — for example requiring encryption with a specific key and denying access from unapproved principals for resources tagged as restricted.",
   "C": "Record the classification of each dataset in a spreadsheet reviewed annually.",
   "D": "Add the classification to the table description field in the Glue Data Catalog and rely on engineers reading it.",
   "E": "Name every restricted table with a confidential_ prefix so people recognise it."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Classification becomes operational when it drives enforcement: LF-Tags allow tag-based access control so permissions follow the label as data evolves, and tag-conditioned policies turn the label into an actual restriction on keys and principals. A spreadsheet (option C), a description field (option D) and a naming convention (option E) all convey intent to humans but enforce nothing, and they drift as soon as data changes hands."
 },
 {
  "id": "dea-181",
  "source": "authored",
  "domain": 4,
  "topic": "KMS key policies and grants",
  "difficulty": "hard",
  "multi": false,
  "question": "A Glue job in account A must read S3 objects in account B that are encrypted with a customer managed KMS key owned by account B. The bucket policy already allows the Glue role. The job still fails with an access denied error mentioning the key. What else is required?",
  "choices": {
   "A": "The KMS key policy in account B must allow the account A Glue role to use the key for decryption, and the Glue role's identity policy must allow kms:Decrypt on that key ARN.",
   "B": "The Glue job must be moved into account B.",
   "C": "The bucket must be reconfigured to use SSE-S3 instead of SSE-KMS.",
   "D": "The Glue role must be granted s3:GetObjectVersion in addition to s3:GetObject."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cross-account access to KMS-encrypted objects needs permission on the key as well as the bucket: the key policy in the owning account must allow the external principal, and the caller's identity policy must permit kms:Decrypt on that key — both sides, as with any cross-account resource. Relocating the job (option B) works around the requirement rather than meeting it. Switching to SSE-S3 (option C) weakens the control the company deliberately chose. GetObjectVersion (option D) matters for versioned object reads, not for a key-related denial."
 },
 {
  "id": "dea-182",
  "source": "authored",
  "domain": 4,
  "topic": "S3 Access Points",
  "difficulty": "medium",
  "multi": false,
  "question": "A single lake bucket serves many teams, and its bucket policy has grown to hundreds of lines mixing prefixes, principals and conditions. The team wants simpler, per-application access control without splitting the bucket. What should they adopt?",
  "choices": {
   "A": "Create an S3 Access Point per application with its own access point policy scoped to the relevant prefix, and delegate access control to those policies.",
   "B": "Move each prefix into its own bucket and give each a small bucket policy.",
   "C": "Replace the bucket policy with IAM identity policies containing the same conditions.",
   "D": "Enable S3 Object Ownership with bucket owner enforced."
  },
  "answer": [
   "A"
  ],
  "explanation": "Access Points give each application its own network-addressable endpoint and policy scoped to a prefix, which decomposes one sprawling bucket policy into small, independently managed ones without moving data. Splitting into many buckets (option B) is a large migration and multiplies bucket-level configuration. Moving the same conditions into identity policies (option C) relocates the complexity and loses the resource-side control. Object Ownership (option D) settles ACL behaviour and has nothing to do with per-application authorisation."
 },
 {
  "id": "dea-183",
  "source": "authored",
  "domain": 4,
  "topic": "DynamoDB fine-grained access",
  "difficulty": "hard",
  "multi": false,
  "question": "A multi-tenant application stores all tenants in one DynamoDB table with tenant_id as the partition key. Each tenant's application role must be able to read and write only its own items. Which mechanism enforces this?",
  "choices": {
   "A": "An IAM policy on each tenant role using the dynamodb:LeadingKeys condition key to restrict operations to that tenant's partition key value.",
   "B": "A DynamoDB resource-based policy that lists each tenant's items individually.",
   "C": "A filter expression in the application code that limits every query to the tenant's items.",
   "D": "A global secondary index per tenant with permissions granted on the index."
  },
  "answer": [
   "A"
  ],
  "explanation": "The dynamodb:LeadingKeys condition key restricts a principal's requests to items whose partition key matches specified values, which is DynamoDB's native fine-grained access control for exactly this multi-tenant pattern. A resource policy enumerating items (option B) is not how DynamoDB authorisation works and could never scale. Application-side filter expressions (option C) are a coding convention, bypassable and not a security control. A GSI per tenant (option D) is unworkable at any tenant count and still would not prevent base-table reads."
 },
 {
  "id": "dea-184",
  "source": "authored",
  "domain": 4,
  "topic": "Temporary credentials for pipelines",
  "difficulty": "medium",
  "multi": false,
  "question": "A legacy ingestion script running on Amazon EC2 authenticates to AWS with long-lived access keys stored in a configuration file. Security wants the keys eliminated. What should replace them?",
  "choices": {
   "A": "An IAM role attached to the instance through an instance profile, so the SDK obtains temporary credentials automatically.",
   "B": "Access keys stored in AWS Secrets Manager and fetched at startup.",
   "C": "Access keys rotated every 30 days by a scheduled Lambda function.",
   "D": "Access keys encrypted with KMS and decrypted by the script at runtime."
  },
  "answer": [
   "A"
  ],
  "explanation": "An instance profile lets the SDK retrieve short-lived, automatically rotated credentials from the instance metadata service, removing static keys entirely — the outcome security asked for. Storing keys in Secrets Manager (option B), rotating them on a schedule (option C) or encrypting them at rest (option D) all keep long-lived credentials in existence and merely change where they live or how often they change."
 },
 {
  "id": "dea-185",
  "source": "authored",
  "domain": 4,
  "topic": "Governance across accounts",
  "difficulty": "medium",
  "multi": true,
  "question": "A company is standing up a governed multi-account data platform. Which TWO practices most directly support consistent governance as new accounts are added?",
  "choices": {
   "A": "Use AWS Control Tower or an equivalent landing zone with organisational units, guardrails and account baselines applied automatically to new accounts.",
   "B": "Centralise catalog governance in Lake Formation with tag-based access control, and share data to consumer accounts through cross-account grants.",
   "C": "Give each new team a standalone account with no organisational membership so blast radius is limited.",
   "D": "Ask each team to copy the security settings from an existing account when they onboard.",
   "E": "Grant every data engineer AdministratorAccess in the sandbox and production accounts to avoid access delays."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A landing zone applies guardrails and baselines to accounts as they are created, so governance does not depend on anyone remembering, and Lake Formation with LF-Tags centralises data permissions and cross-account sharing so the same rules apply wherever the data is consumed. Standalone accounts outside the organisation (option C) cannot receive SCPs or centralised controls. Copying settings by hand (option D) guarantees drift. Blanket administrator access (option E) removes the separation of duties governance depends on."
 },
 {
  "id": "dea-186",
  "source": "authored",
  "domain": 4,
  "topic": "Redshift role-based access control",
  "difficulty": "medium",
  "multi": false,
  "question": "Managing per-user GRANT statements in Amazon Redshift has become unmanageable as staff join and change teams. The team wants permissions granted to job functions and users assigned to them. Which approach should they use?",
  "choices": {
   "A": "Define Redshift roles for each job function, grant object privileges to the roles, and grant roles to users — optionally mapping them from the identity provider.",
   "B": "Create one database user per team and share its password among team members.",
   "C": "Grant all privileges to PUBLIC and rely on an acceptable use policy.",
   "D": "Create a separate Redshift cluster per team so no in-cluster permissions are needed."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift supports role-based access control: privileges are granted to roles that represent job functions and users receive roles, so a joiner or mover is handled by changing role membership rather than dozens of object grants, and roles can be driven from federated identity. Shared team accounts (option B) destroy individual accountability and are a common audit finding. Granting to PUBLIC (option C) removes access control altogether. A cluster per team (option D) multiplies cost and fragments the data."
 },
 {
  "id": "dea-187",
  "source": "authored",
  "domain": 4,
  "topic": "Federated access for analysts",
  "difficulty": "medium",
  "multi": false,
  "question": "Analysts already authenticate through the company's identity provider. They now need Athena and QuickSight access without separate AWS credentials, with permissions derived from their existing groups. What should be configured?",
  "choices": {
   "A": "Federate through AWS IAM Identity Center connected to the identity provider, mapping groups to permission sets and to Lake Formation and QuickSight permissions.",
   "B": "Create an IAM user for each analyst and send them access keys.",
   "C": "Create one shared IAM role with console access and distribute the sign-in link.",
   "D": "Create an IAM user per team and enable multi-factor authentication on it."
  },
  "answer": [
   "A"
  ],
  "explanation": "IAM Identity Center brokers the existing identity provider into AWS, so analysts sign in with their corporate identity, group membership drives permission sets, and downstream services such as Lake Formation and QuickSight can key their permissions off the same identity. Per-analyst IAM users with access keys (option B) reintroduce long-lived credentials and a parallel identity store. A shared role or user (options C and D) removes individual attribution, which breaks auditing."
 },
 {
  "id": "dea-188",
  "source": "authored",
  "domain": 4,
  "topic": "Protecting data in QuickSight",
  "difficulty": "medium",
  "multi": false,
  "question": "A QuickSight dashboard is shared with 400 users across many countries, but each user must see only their own country's rows. The dataset is a single SPICE dataset. What should be configured?",
  "choices": {
   "A": "A row-level security rules dataset that maps each user or group to permitted country values, applied to the SPICE dataset.",
   "B": "One duplicated dashboard per country with a hard-coded filter.",
   "C": "A parameter with a default country value that users can change.",
   "D": "Separate QuickSight accounts per country."
  },
  "answer": [
   "A"
  ],
  "explanation": "QuickSight row-level security uses a rules dataset that maps users or groups to allowed field values and enforces the filter server-side, so a single dataset and dashboard serve all 400 users correctly. Duplicating dashboards per country (option B) multiplies maintenance and still relies on sharing discipline. A parameter (option C) is a user-changeable convenience, not a control. Separate accounts (option D) fragments the deployment enormously for a filtering requirement."
 },
 {
  "id": "dea-189",
  "source": "authored",
  "domain": 4,
  "topic": "Compliance evidence and configuration drift",
  "difficulty": "medium",
  "multi": false,
  "question": "An auditor asks for continuous evidence that every S3 bucket in the organisation has encryption and public access blocking enabled, with automatic correction when a bucket drifts. Which combination is appropriate?",
  "choices": {
   "A": "AWS Config with organisation-wide rules for the required settings, plus automatic remediation actions through Systems Manager Automation documents.",
   "B": "A weekly script that lists buckets and emails a report to the auditor.",
   "C": "Amazon Macie scans of every bucket on a monthly schedule.",
   "D": "AWS CloudTrail alerts on every PutBucketEncryption call."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Config continuously evaluates resource configuration against rules, records compliance history as audit evidence, works organisation-wide through conformance packs, and can invoke Systems Manager Automation to remediate a non-compliant bucket automatically. A weekly script (option B) is neither continuous nor self-correcting. Macie (option C) inspects content for sensitive data, not bucket configuration. CloudTrail alerts (option D) show individual API calls without evaluating overall compliance state or fixing it."
 },
 {
  "id": "dea-190",
  "source": "authored",
  "domain": 4,
  "topic": "Sensitive data in logs",
  "difficulty": "hard",
  "multi": false,
  "question": "A review finds that application logs shipped to CloudWatch Logs contain customer email addresses in error messages. The team must stop the exposure and reduce the risk of recurrence. Which combination is most effective?",
  "choices": {
   "A": "Remove the personal data at the source by logging identifiers instead of values, and apply CloudWatch Logs data protection policies to mask sensitive patterns in transit and at rest.",
   "B": "Restrict CloudWatch Logs read access to the security team and leave the logging code unchanged.",
   "C": "Reduce log retention to one day so exposure is short lived.",
   "D": "Encrypt the log group with a customer managed KMS key."
  },
  "answer": [
   "A"
  ],
  "explanation": "The durable fix is to stop emitting personal data — log a customer identifier rather than an email address — with Logs data protection policies masking known sensitive patterns as defence in depth against future regressions. Restricting read access (option B) narrows the audience but the data is still collected and stored. Shortening retention (option C) limits the window without preventing exposure. KMS encryption (option D) protects the log group at rest while every authorised reader still sees the plaintext."
 },
 {
  "id": "dea-191",
  "source": "authored",
  "domain": 4,
  "topic": "Network isolation for Redshift",
  "difficulty": "medium",
  "multi": false,
  "question": "A Redshift cluster must be reachable only from within the company's VPC and its on-premises network over AWS Direct Connect, never from the internet. Which configuration achieves this?",
  "choices": {
   "A": "Deploy the cluster in private subnets with a cluster subnet group, leave it not publicly accessible, and control access with security groups referencing the approved CIDR ranges and security groups.",
   "B": "Deploy the cluster in public subnets and restrict access using a security group allowing only the office IP address.",
   "C": "Deploy the cluster in private subnets and place a NAT gateway in front of it.",
   "D": "Deploy the cluster with an Elastic IP address and use a network ACL to deny internet ranges."
  },
  "answer": [
   "A"
  ],
  "explanation": "A cluster in private subnets and marked not publicly accessible has no internet-routable endpoint, and security groups then restrict which VPC and Direct Connect ranges can connect — meeting both requirements structurally rather than by filtering. A public cluster with a narrow security group (option B) still exposes an internet-reachable endpoint and depends entirely on the rule staying correct. A NAT gateway (option C) provides outbound access and does nothing for inbound. An Elastic IP with deny-listed ranges (option D) is a public endpoint plus an unmaintainable blocklist."
 },
 {
  "id": "dea-192",
  "source": "authored",
  "domain": 4,
  "topic": "Client-side versus server-side encryption",
  "difficulty": "hard",
  "multi": false,
  "question": "A requirement states that AWS must never have access to the plaintext of a particular dataset, even momentarily inside a managed service. Which encryption approach satisfies this?",
  "choices": {
   "A": "Client-side encryption, where the data is encrypted before it leaves the company's environment using keys the company controls, so the service stores only ciphertext.",
   "B": "Server-side encryption with a customer managed KMS key.",
   "C": "Server-side encryption with customer-provided keys (SSE-C).",
   "D": "Server-side encryption with S3 managed keys."
  },
  "answer": [
   "A"
  ],
  "explanation": "Only client-side encryption keeps plaintext out of the service entirely: the data arrives already encrypted and the provider never handles the clear values or the keys. All server-side options involve the service receiving plaintext and encrypting it — a customer managed KMS key (option B) gives control and auditability but not plaintext isolation, SSE-C (option C) has the customer supply the key with each request while S3 performs the encryption on plaintext it receives, and SSE-S3 (option D) gives the least control of all."
 },
 {
  "id": "dea-193",
  "source": "authored",
  "domain": 4,
  "topic": "Lake Formation permissions model",
  "difficulty": "hard",
  "multi": true,
  "question": "A team is migrating a data lake from IAM-only access control to AWS Lake Formation. Which TWO statements about the resulting permission model are correct?",
  "choices": {
   "A": "Lake Formation permissions are evaluated in addition to IAM permissions, so a principal generally needs both the Lake Formation grant and the underlying IAM permission for the integrated service to succeed.",
   "B": "Registering an S3 location with Lake Formation lets it vend temporary credentials for that location, so data access can be granted through catalog permissions rather than direct S3 policies.",
   "C": "Lake Formation replaces IAM entirely for data lake resources, so IAM policies no longer affect access.",
   "D": "Lake Formation grants apply only to Amazon Athena and have no effect on AWS Glue jobs or Amazon Redshift Spectrum.",
   "E": "Lake Formation encrypts the underlying S3 objects automatically as part of registering a location."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Lake Formation layers catalog-level permissions on top of IAM rather than replacing it, so both must permit the action, and registering an S3 location allows Lake Formation to vend scoped temporary credentials so consumers no longer need broad direct S3 policies. IAM continues to apply (option C). Lake Formation permissions are honoured by several integrated services, including Glue, Athena and Redshift Spectrum, not Athena alone (option D). Registration does not encrypt data (option E); encryption remains an S3 and KMS configuration."
 },
 {
  "id": "dea-194",
  "source": "authored",
  "domain": 4,
  "topic": "Protecting against accidental exposure",
  "difficulty": "medium",
  "multi": false,
  "question": "Leadership wants assurance that no S3 bucket in any account can be made public, even by mistake. Which control is the most reliable?",
  "choices": {
   "A": "Enable S3 Block Public Access at the account level in every account and enforce it with a service control policy preventing the setting from being disabled.",
   "B": "Enable Block Public Access on each bucket as it is created.",
   "C": "Run a daily Lambda function that scans buckets and removes public ACLs.",
   "D": "Rely on IAM Access Analyzer findings reviewed weekly."
  },
  "answer": [
   "A"
  ],
  "explanation": "Account-level Block Public Access overrides bucket-level settings for every bucket present and future, and an SCP that denies changing it removes the ability to undo the control locally — prevention rather than detection. Per-bucket settings (option B) depend on every creator remembering. A daily sweeper (option C) leaves up to a day of exposure. Access Analyzer findings reviewed weekly (option D) are valuable detection but do not stop the exposure happening."
 },
 {
  "id": "dea-195",
  "source": "authored",
  "domain": 4,
  "topic": "Auditing Redshift SQL activity",
  "difficulty": "medium",
  "multi": false,
  "question": "A compliance requirement is to retain a record of every SQL statement run against a Redshift cluster, including who ran it, for two years. What should be enabled?",
  "choices": {
   "A": "Redshift database audit logging with the user activity log enabled, delivered to Amazon S3 or CloudWatch Logs with an appropriate retention configuration.",
   "B": "AWS CloudTrail management events for the Redshift service.",
   "C": "Enhanced VPC routing on the cluster.",
   "D": "Redshift Advisor recommendations exported monthly."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift audit logging produces connection, user and user activity logs, the last of which records the SQL statements executed and the user who ran them, delivered to S3 or CloudWatch Logs where a retention policy or lifecycle rule keeps them for two years. CloudTrail (option B) records control-plane API calls such as cluster modifications, not the SQL executed inside the database. Enhanced VPC routing (option C) forces cluster traffic through the VPC for network control. Advisor (option D) offers optimisation recommendations."
 },
 {
  "id": "dea-196",
  "source": "authored",
  "domain": 4,
  "topic": "Encrypting an existing unencrypted store",
  "difficulty": "hard",
  "multi": false,
  "question": "An existing Amazon Redshift cluster was created without encryption and must now be encrypted with a customer managed KMS key, with minimal disruption. What is the correct approach?",
  "choices": {
   "A": "Modify the cluster to enable KMS encryption, accepting that Redshift migrates the data to new encrypted storage in the background and the cluster is read-only for part of the operation — or restore a snapshot into a new encrypted cluster and cut over.",
   "B": "Enable default encryption on the S3 bucket holding the cluster's snapshots, which retroactively encrypts the cluster.",
   "C": "Attach a KMS key policy to the cluster's IAM role, which transparently encrypts existing blocks.",
   "D": "Run VACUUM with the ENCRYPT option on every table."
  },
  "answer": [
   "A"
  ],
  "explanation": "Redshift supports enabling KMS encryption on an existing cluster, migrating data to new encrypted storage in the background with a period of reduced availability, and the alternative is to restore a snapshot into a new encrypted cluster and switch over — the two supported paths. Encrypting the snapshot bucket (option B) does not encrypt the cluster's own storage. A key policy on a role (option C) grants key usage and encrypts nothing by itself. There is no ENCRYPT option on VACUUM (option D)."
 },
 {
  "id": "dea-197",
  "source": "authored",
  "domain": 4,
  "topic": "Separation of duties in pipelines",
  "difficulty": "medium",
  "multi": false,
  "question": "An audit finding states that the same engineers who write ETL code can also change production data permissions and read raw personal data. Which change addresses the finding while keeping the team productive?",
  "choices": {
   "A": "Separate the roles: engineers deploy code through a pipeline that assumes a deployment role, while data permission changes and access to raw personal data require a different role held by a data governance function.",
   "B": "Require engineers to record in a ticket each time they change permissions or read personal data.",
   "C": "Rotate the engineers' credentials weekly.",
   "D": "Grant engineers read-only access to production and have them make all changes in development."
  },
  "answer": [
   "A"
  ],
  "explanation": "Separation of duties means the ability to change controls and the ability to change code live with different principals: a deployment pipeline role for code and a governance role for permissions and sensitive data. Ticketing (option B) documents actions without limiting them. Credential rotation (option C) is unrelated to which privileges a principal holds. Read-only production access (option D) does not by itself stop reads of raw personal data, and it blocks legitimate deployment work rather than separating it."
 },
 {
  "id": "dea-198",
  "source": "authored",
  "domain": 4,
  "topic": "Data sharing with external parties",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must share a curated dataset with an external partner who has their own AWS account, with per-object access recorded, revocable at any time, and no copies retained by the company's own delivery process. Which mechanism is most appropriate?",
  "choices": {
   "A": "Grant cross-account access to a dedicated S3 prefix through a bucket policy or access point limited to the partner's account role, with CloudTrail data events for auditing.",
   "B": "Email the dataset as a compressed archive each month.",
   "C": "Generate presigned URLs valid for 90 days and post them on an internal wiki.",
   "D": "Create an IAM user in the company's account for the partner and share its access keys."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cross-account access to a scoped prefix keeps a single copy of the data, is revoked instantly by editing the policy, and with CloudTrail data events every object read is attributable to the partner's principal. Email (option B) creates uncontrolled copies and offers no revocation. Long-lived presigned URLs on a wiki (option C) are bearer tokens that cannot be revoked individually and can leak. Sharing access keys for an IAM user (option D) hands long-lived credentials to a third party and destroys attribution."
 },
 {
  "id": "dea-199",
  "source": "authored",
  "domain": 4,
  "topic": "Detecting sensitive data in new pipelines",
  "difficulty": "hard",
  "multi": true,
  "question": "A company wants to prevent unclassified personal data from silently entering the analytics zone through new pipelines. Which TWO controls best support this?",
  "choices": {
   "A": "Run sensitive-data detection in the transformation stage — for example the Glue PII detection transform — and fail or quarantine the load when unexpected personal data is found.",
   "B": "Schedule Amazon Macie discovery jobs over the landing and analytics prefixes and route findings to Security Hub for triage.",
   "C": "Require a manual data review meeting before any new pipeline is deployed, with no automated checks.",
   "D": "Rely on the fact that the analytics zone is encrypted at rest with KMS.",
   "E": "Restrict the analytics zone to read-only access for all principals, including the pipelines."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Detection at write time — a PII detection transform that fails or quarantines an unexpected load — stops the data entering, and periodic Macie discovery over the prefixes catches what the pipeline checks missed, with findings triaged centrally. A review meeting alone (option C) does not scale and misses schema changes made after approval. Encryption at rest (option D) protects stored data without governing what is stored. Making the analytics zone read-only for pipelines (option E) would prevent all loading, not just unclassified data."
 },
 {
  "id": "dea-200",
  "source": "authored",
  "domain": 4,
  "topic": "Backup immutability",
  "difficulty": "medium",
  "multi": false,
  "question": "A ransomware tabletop exercise revealed that an attacker with administrator credentials could delete the company's backups. Which control prevents that for backups managed by AWS Backup?",
  "choices": {
   "A": "AWS Backup Vault Lock in compliance mode, which prevents deletion of recovery points and shortening of retention, even by the account root user.",
   "B": "A backup vault access policy denying delete actions to all principals.",
   "C": "Copying backups to a second vault in the same account.",
   "D": "Enabling multi-factor authentication on the administrator accounts."
  },
  "answer": [
   "A"
  ],
  "explanation": "Vault Lock in compliance mode makes recovery points immutable for their retention period and cannot be disabled or shortened by anyone, including root — the specific defence against a credentialed attacker. A vault access policy (option B) can be edited by a principal with sufficient permissions. A second vault in the same account (option C) is within the same blast radius. MFA (option D) raises the bar for account compromise but does nothing once an administrator session exists."
 },
 {
  "id": "dea-201",
  "source": "authored",
  "domain": 1,
  "topic": "Firehose transformation failures",
  "difficulty": "medium",
  "multi": true,
  "question": "A Firehose transformation Lambda function must handle records it cannot parse without stalling the stream. Which TWO behaviours should the function implement?",
  "choices": {
   "A": "Return each unparseable record with a result of ProcessingFailed so Firehose delivers it to the error output prefix instead of the destination.",
   "B": "Return every record it received, with each one marked Ok, Dropped or ProcessingFailed and the same record ID it was given.",
   "C": "Raise an unhandled exception so the whole batch is retried indefinitely until the bad record is removed upstream.",
   "D": "Silently omit unparseable records from the response array to keep the payload small.",
   "E": "Write unparseable records directly to the destination without transformation."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Firehose expects the function to return an entry for every input record, keyed by the record ID it supplied, with an explicit status; ProcessingFailed routes the bad record to the configured error prefix so it is preserved and the stream keeps moving. Throwing an exception (option C) causes the whole batch to be retried and can stall delivery. Omitting records from the response (option D) is treated as a failure of the invocation because the record IDs do not match. Writing raw unparseable records to the destination (option E) corrupts the target dataset."
 },
 {
  "id": "dea-202",
  "source": "authored",
  "domain": 1,
  "topic": "Choosing an ingestion service",
  "difficulty": "medium",
  "multi": true,
  "question": "A team needs to land streaming records in Amazon S3 with no consumer code, no ordering requirement and a tolerance of a minute or two of delay. Which TWO characteristics make Amazon Data Firehose the right choice over Kinesis Data Streams with a custom consumer?",
  "choices": {
   "A": "Firehose delivers to supported destinations automatically, so there is no consumer application to write, deploy or scale.",
   "B": "Firehose can convert records to Parquet or ORC and compress them before delivery, without a separate job.",
   "C": "Firehose retains records for up to 365 days so consumers can replay history.",
   "D": "Firehose guarantees strict ordering of records within a partition key.",
   "E": "Firehose provides sub-second end-to-end delivery latency."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Firehose's value here is that delivery is a managed feature — no consumer to operate — and that it can convert and compress records into an analytics-friendly format on the way. It is not a replayable log: it buffers briefly and delivers, so there is no multi-day retention for replay (option C) and no per-key ordering guarantee (option D); those are Kinesis Data Streams properties. Delivery latency is measured in seconds to minutes depending on buffering, not sub-second (option E)."
 },
 {
  "id": "dea-203",
  "source": "authored",
  "domain": 1,
  "topic": "Incremental extraction patterns",
  "difficulty": "hard",
  "multi": true,
  "question": "A nightly job extracts changed rows from a relational source using a last_updated watermark. Analysts report that some updates never appear in the lake. Which TWO causes are most likely?",
  "choices": {
   "A": "Rows deleted in the source are invisible to a watermark query, so deletions never propagate.",
   "B": "Transactions that commit after the extract reads the watermark but with an earlier last_updated value are missed because the boundary is based on update time rather than commit visibility.",
   "C": "The source database uses row-level locking, which prevents the extract from reading committed rows.",
   "D": "Parquet cannot represent updated rows, so the writes are silently discarded.",
   "E": "The Glue Data Catalog caches table schemas, which drops changed columns."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Watermark extraction has two classic gaps: it sees only rows that still exist, so deletes never appear, and a long-running transaction can commit after the extract's cut-off while carrying an earlier last_updated value, so that row falls outside both the current and the next window. Both are reasons to prefer log-based CDC. Row-level locking (option C) does not hide committed rows from a reader. Parquet stores whatever rows are written (option D). Catalog schema caching (option E) does not silently drop row updates."
 },
 {
  "id": "dea-204",
  "source": "authored",
  "domain": 1,
  "topic": "Streaming versus batch decision",
  "difficulty": "medium",
  "multi": true,
  "question": "A team must decide between a streaming pipeline and an hourly batch pipeline for a new dataset. Which TWO factors argue for streaming?",
  "choices": {
   "A": "Business decisions depend on the data being no more than a minute old.",
   "B": "The source emits a continuous, unbounded flow of events that must be processed as they arrive.",
   "C": "The transformation requires a full re-aggregation over all historical data on every run.",
   "D": "The data arrives as one file per day from a partner SFTP drop.",
   "E": "The team wants to minimise the number of always-running components to operate."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Streaming earns its extra complexity when freshness is a business requirement and the source is genuinely unbounded and continuous. A transformation that must re-aggregate all history each run (option C) is inherently batch shaped. A daily partner file (option D) has no continuous arrival to react to. Minimising always-running components (option E) is an argument for batch or event-triggered processing, not for streaming."
 },
 {
  "id": "dea-205",
  "source": "authored",
  "domain": 1,
  "topic": "Glue job parameters and reuse",
  "difficulty": "medium",
  "multi": true,
  "question": "A team maintains twelve nearly identical Glue jobs that differ only in source table, target prefix and a date filter. Which TWO changes reduce duplication without losing per-run control?",
  "choices": {
   "A": "Consolidate into one parameterised job that reads source, target and date as job arguments supplied at run time.",
   "B": "Invoke the single job from an orchestrator such as Step Functions or a Glue workflow, passing different arguments per invocation.",
   "C": "Copy the shared logic into each job's script and keep the twelve jobs, adding a comment noting they must be kept in sync.",
   "D": "Hard-code all twelve variants inside one script and branch on the job run ID.",
   "E": "Replace the jobs with twelve Athena CTAS statements executed by hand."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "One parameterised job definition plus an orchestrator that supplies per-run arguments removes the duplication while keeping each run individually configurable and independently observable. Copying shared logic with a sync-by-convention comment (option C) is the status quo with extra optimism. Branching on run ID inside one script (option D) hides configuration in code and is unreadable at twelve variants. Manual CTAS statements (option E) abandons automation altogether."
 },
 {
  "id": "dea-206",
  "source": "authored",
  "domain": 1,
  "topic": "Kinesis resharding",
  "difficulty": "hard",
  "multi": true,
  "question": "A provisioned Kinesis data stream must be scaled from 8 to 16 shards while consumers keep running. Which TWO statements are true about this operation?",
  "choices": {
   "A": "Splitting shards creates new child shards, and the parent shards remain readable until their retained data ages out, so consumers must finish the parents before moving on.",
   "B": "The Kinesis Client Library handles the parent-to-child transition automatically by checkpointing each parent shard to completion before starting its children.",
   "C": "Resharding rewrites the partition key hash assignments of already-stored records into the new shards.",
   "D": "Consumers must be stopped for the duration of the resharding operation.",
   "E": "Resharding resets the stream's retention period to the default of 24 hours."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Resharding creates child shards while parents remain readable for their retained data, and ordering across the split is preserved only if consumers drain each parent before its children — which the Kinesis Client Library manages through its lease and checkpoint mechanism. Existing records are not moved or rehashed into new shards (option C); only new writes follow the new hash ranges. Consumers keep running throughout (option D), and retention configuration is unaffected (option E)."
 },
 {
  "id": "dea-207",
  "source": "authored",
  "domain": 1,
  "topic": "Data contract enforcement",
  "difficulty": "medium",
  "multi": true,
  "question": "A platform team wants producers to be held to an agreed schema and quality standard before data reaches consumers. Which TWO mechanisms enforce a data contract rather than merely documenting it?",
  "choices": {
   "A": "Register schemas in the AWS Glue Schema Registry with a compatibility mode, so incompatible producer changes are rejected at serialization time.",
   "B": "Evaluate AWS Glue Data Quality rules on ingestion and fail or quarantine loads that violate the agreed thresholds.",
   "C": "Publish a wiki page describing the expected schema and quality expectations.",
   "D": "Send a monthly report of schema changes to the producing teams.",
   "E": "Ask consumers to defensively handle any schema they encounter."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A contract is enforced when a violation actually blocks something: registry compatibility checks reject an incompatible schema at serialization, and data quality rules fail or quarantine a non-conforming load before consumers see it. A wiki page (option C) and a monthly report (option D) inform without preventing. Defensive consumers (option E) accept whatever arrives, which is the absence of a contract."
 },
 {
  "id": "dea-208",
  "source": "authored",
  "domain": 2,
  "topic": "Redshift table design review",
  "difficulty": "hard",
  "multi": true,
  "question": "A large Redshift fact table performs poorly. Which TWO design choices should be reviewed first?",
  "choices": {
   "A": "The distribution style and key, since a mismatch with the dominant join causes redistribution or broadcast on every query.",
   "B": "The sort key, since queries filtering on an unsorted column cannot skip blocks.",
   "C": "The primary key constraint, which Redshift enforces on every insert.",
   "D": "The choice of VARCHAR over CHAR, which determines whether Redshift compresses the column.",
   "E": "The number of databases in the cluster, which limits parallelism per table."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Distribution and sort keys are the two physical design decisions that dominate Redshift query performance: the first governs how much data moves between slices for joins, the second governs how much can be skipped on scans. Redshift does not enforce primary key constraints (option C) — they are informational hints to the planner. Compression encoding is chosen per column and is not determined by CHAR versus VARCHAR (option D). The number of databases (option E) has no bearing on per-table parallelism."
 },
 {
  "id": "dea-209",
  "source": "authored",
  "domain": 2,
  "topic": "Choosing between Athena and Redshift",
  "difficulty": "medium",
  "multi": true,
  "question": "A team is deciding whether to serve a workload from Amazon Athena over S3 or from an Amazon Redshift cluster. Which TWO factors favour Redshift?",
  "choices": {
   "A": "Many concurrent users running repetitive dashboard queries that benefit from result caching, materialized views and workload management.",
   "B": "Complex multi-table joins over large volumes where local columnar storage, sort keys and distribution keys deliver consistently lower latency.",
   "C": "Sporadic ad hoc exploration of rarely queried data where paying for idle capacity is unattractive.",
   "D": "A requirement to avoid managing or sizing any persistent compute.",
   "E": "A need to query data in place in Amazon S3 without loading it first."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Redshift's advantages are its managed workload concurrency features and its control over physical layout, both of which pay off for steady, join-heavy, high-concurrency workloads. Sporadic exploration (option C), avoiding persistent compute (option D) and querying data in place in S3 (option E) all describe Athena's strengths — though Redshift Serverless narrows the capacity-management gap and Spectrum narrows the query-in-place gap."
 },
 {
  "id": "dea-210",
  "source": "authored",
  "domain": 2,
  "topic": "DynamoDB to analytics integration",
  "difficulty": "medium",
  "multi": true,
  "question": "A team must make DynamoDB data available for analytics in the data lake. Which TWO approaches are appropriate depending on latency needs?",
  "choices": {
   "A": "Use the DynamoDB export to Amazon S3 feature for periodic full or incremental exports that consume no table read capacity.",
   "B": "Enable DynamoDB Streams and process the change records with Lambda or Kinesis to maintain a near-real-time copy in the lake.",
   "C": "Run a nightly full Scan of the table with a high parallel segment count during peak hours.",
   "D": "Create a global secondary index projecting all attributes and query it with Amazon Athena directly.",
   "E": "Point Amazon Redshift Spectrum at the DynamoDB table as an external table."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Export to S3 covers the batch case without touching table capacity, and Streams-based propagation covers the near-real-time case — the two supported patterns, chosen by how fresh the lake copy must be. A peak-hours parallel Scan (option C) burns read capacity and competes with production traffic. Athena cannot query a DynamoDB index directly without a federated connector (option D). Redshift Spectrum reads S3 data through an external catalog, not DynamoDB tables (option E)."
 },
 {
  "id": "dea-211",
  "source": "authored",
  "domain": 2,
  "topic": "Data lake zones",
  "difficulty": "easy",
  "multi": true,
  "question": "A company is designing raw, curated and consumption zones for its data lake. Which TWO practices are consistent with this pattern?",
  "choices": {
   "A": "Keep the raw zone immutable and in the source's original fidelity, so any downstream transformation can be re-derived from it.",
   "B": "Store curated and consumption data in a columnar format, partitioned and sized for the query engines that read it.",
   "C": "Allow analysts to write ad hoc outputs back into the raw zone so results are kept close to the inputs.",
   "D": "Grant all users the same permissions across every zone to keep access management simple.",
   "E": "Delete raw data as soon as the curated table is built, since the curated table is authoritative."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "An immutable, full-fidelity raw zone makes reprocessing possible when transformation logic changes or a bug is found, and columnar, partitioned curated and consumption layers are what query engines read efficiently. Writing ad hoc analyst output into raw (option C) destroys its immutability and provenance. Uniform permissions across zones (option D) defeats the governance purpose of separating them. Deleting raw data (option E) removes the ability to rebuild anything downstream."
 },
 {
  "id": "dea-212",
  "source": "authored",
  "domain": 2,
  "topic": "Handling large dimension joins",
  "difficulty": "hard",
  "multi": true,
  "question": "In a lake-based Spark pipeline, a fact-to-dimension join is slow. Which TWO techniques are legitimate optimisations?",
  "choices": {
   "A": "Broadcast the dimension when it is small enough to fit comfortably in executor memory, turning the shuffle join into a map-side join.",
   "B": "Pre-partition or bucket both datasets on the join key so matching rows are colocated and the shuffle is avoided on repeated joins.",
   "C": "Increase the driver memory so the driver can perform the join itself.",
   "D": "Cache the fact table in memory before the join so the shuffle is skipped.",
   "E": "Disable adaptive query execution so Spark uses a fixed plan."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Broadcasting a small dimension eliminates the shuffle entirely, and pre-partitioning or bucketing both sides on the join key colocates matching rows so repeated joins avoid reshuffling. The driver does not execute joins (option C); enlarging it only postpones a different failure. Caching the fact table (option D) speeds re-reads but the shuffle still happens. Adaptive query execution (option E) generally improves join plans and skew handling, so disabling it usually hurts."
 },
 {
  "id": "dea-213",
  "source": "authored",
  "domain": 3,
  "topic": "Incident response for pipelines",
  "difficulty": "medium",
  "multi": true,
  "question": "A curated table has been publishing incorrect numbers for two days before anyone noticed. Which TWO follow-up actions best reduce the chance of a repeat?",
  "choices": {
   "A": "Add automated data quality checks that fail the publish step when key metrics fall outside expected bounds.",
   "B": "Add a freshness and completeness alarm that pages when the table is not updated correctly by its deadline.",
   "C": "Ask analysts to check the dashboard each morning and report anything unusual.",
   "D": "Increase the pipeline's retry count so transient issues self-heal.",
   "E": "Extend the CloudWatch Logs retention period for the pipeline's log group."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Both chosen actions turn a silent failure into a detected one: quality gates stop bad data being published, and freshness and completeness alarms catch the case where nothing was published or the publish was partial. Relying on analysts to notice (option C) is what already failed. More retries (option D) address transient failures, not incorrect output. Longer log retention (option E) helps investigate the next incident without shortening the time to detect it."
 },
 {
  "id": "dea-214",
  "source": "authored",
  "domain": 3,
  "topic": "Cost drivers in analytics",
  "difficulty": "medium",
  "multi": true,
  "question": "A team is reducing the cost of an Athena-based analytics platform. Which TWO changes typically deliver the largest savings?",
  "choices": {
   "A": "Convert row-oriented text data to a compressed columnar format so far fewer bytes are scanned per query.",
   "B": "Partition tables on the columns queries filter on most often so entire prefixes are pruned.",
   "C": "Move the S3 data to a Region with lower storage pricing.",
   "D": "Increase the Athena query timeout so fewer queries are retried.",
   "E": "Store query results in S3 Glacier Deep Archive immediately after each query."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Athena is billed by bytes scanned, so the two changes that reduce scanned bytes — columnar compressed storage and effective partition pruning — dominate every other lever, often by an order of magnitude. Region shopping (option C) saves a little on storage while adding data transfer and latency complications. Longer timeouts (option D) affect a rare retry case. Archiving query results (option E) touches a small storage line item and makes results unreadable without a restore."
 },
 {
  "id": "dea-215",
  "source": "authored",
  "domain": 3,
  "topic": "Observability signals",
  "difficulty": "medium",
  "multi": true,
  "question": "A team is instrumenting a new pipeline. Which TWO signals are most useful for detecting problems that matter to data consumers?",
  "choices": {
   "A": "Data freshness — the age of the newest successfully published partition relative to its deadline.",
   "B": "Row count and null rate per load compared with the historical distribution for that dataset.",
   "C": "The number of Spark tasks executed per run.",
   "D": "The average CPU utilisation of the Glue workers.",
   "E": "The number of S3 GET requests issued by the job."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Consumers care whether the data is there, on time, and correct, so freshness against the deadline and volume or null-rate deviation from the historical norm are the signals that map to real impact. Task counts (option C), worker CPU (option D) and S3 request counts (option E) are useful for tuning cost and performance but can look perfectly healthy while the published data is late, incomplete or wrong."
 },
 {
  "id": "dea-216",
  "source": "authored",
  "domain": 3,
  "topic": "Safe schema changes",
  "difficulty": "hard",
  "multi": true,
  "question": "A team must add a column to a widely consumed curated table without breaking downstream jobs. Which TWO practices reduce the risk?",
  "choices": {
   "A": "Make the change additive — a new nullable column with a default meaning — so consumers selecting explicit columns are unaffected.",
   "B": "Announce the change with a deprecation window and verify consumers through query history before removing or renaming anything.",
   "C": "Rename the existing columns at the same time so the schema is tidier after one disruption instead of two.",
   "D": "Change the column order so the new column appears first, making it more visible to consumers.",
   "E": "Drop and recreate the table so the catalog picks up the new schema cleanly."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Additive, nullable changes are backward compatible for consumers that select the columns they need, and an announced window plus evidence from query history means removals happen only after consumers have actually moved. Renaming columns in the same change (option C) is a breaking change bundled with a safe one. Reordering columns (option D) breaks positional readers and some file-format expectations. Dropping and recreating the table (option E) causes an outage and loses table properties and partitions."
 },
 {
  "id": "dea-217",
  "source": "authored",
  "domain": 4,
  "topic": "Defence in depth for the lake",
  "difficulty": "medium",
  "multi": true,
  "question": "A security review recommends defence in depth for a data lake bucket holding regulated data. Which TWO controls contribute distinct layers rather than duplicating one another?",
  "choices": {
   "A": "A bucket policy requiring TLS and restricting access to specific principals and VPC endpoints.",
   "B": "Encryption at rest with a customer managed KMS key whose key policy independently restricts decryption.",
   "C": "Renaming the bucket to something non-obvious so it is harder to guess.",
   "D": "Adding a second bucket policy statement that repeats the same principal restriction.",
   "E": "Turning off CloudTrail for the bucket to reduce log noise."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "The two chosen controls sit at different layers and fail independently: the resource policy governs who may call the API and over what transport and network path, while the KMS key policy independently governs who may decrypt the data. An obscure bucket name (option C) is security by obscurity and provides no control. Repeating a restriction in a second statement (option D) adds no new layer. Disabling CloudTrail (option E) removes the audit layer entirely."
 },
 {
  "id": "dea-218",
  "source": "authored",
  "domain": 4,
  "topic": "Handling a suspected data exposure",
  "difficulty": "hard",
  "multi": true,
  "question": "A publicly readable prefix containing customer data is discovered in a lake bucket. Which TWO actions should be taken first?",
  "choices": {
   "A": "Remove the public access immediately — enable Block Public Access and correct the offending policy or ACL — to stop ongoing exposure.",
   "B": "Preserve and review the access evidence, using CloudTrail data events and S3 server access logs to determine what was read and by whom.",
   "C": "Delete the objects so they can no longer be read, before determining what they contained.",
   "D": "Rotate the AWS account root password and stop all pipelines writing to the bucket indefinitely.",
   "E": "Wait for the next quarterly access review to confirm the finding before acting."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Incident response starts by stopping the bleeding and then establishing scope: remove public access at once, then use CloudTrail data events and server access logs to determine what was accessed and by whom, which drives notification obligations. Deleting the objects first (option C) destroys the evidence needed to scope the incident and may destroy the data itself. Broad, unfocused disruption (option D) causes an outage without addressing the exposure. Waiting for a review cycle (option E) leaves the data exposed."
 },
 {
  "id": "dea-219",
  "source": "authored",
  "domain": 4,
  "topic": "Encryption responsibilities",
  "difficulty": "medium",
  "multi": true,
  "question": "A team is documenting how encryption is applied across their analytics stack. Which TWO statements are correct?",
  "choices": {
   "A": "Amazon S3 applies server-side encryption to new objects by default, and the choice of key material — S3 managed, AWS managed or customer managed KMS — determines who controls and audits key usage.",
   "B": "Amazon Redshift, Amazon EMR and AWS Glue can all be configured to encrypt data at rest with AWS KMS keys, with the specifics set per service — cluster encryption, security configurations and Glue security configurations respectively.",
   "C": "Enabling encryption at rest also encrypts data in transit between services, so TLS configuration is unnecessary.",
   "D": "Once a KMS key is used to encrypt data, the key cannot be rotated without re-encrypting every object.",
   "E": "Encryption at rest removes the need for access control, since only key holders can read the data."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "S3 encrypts new objects server-side by default and the key type determines control and auditability, and the analytics services each expose their own at-rest encryption configuration backed by KMS. Encryption at rest and in transit are separate concerns, so TLS still matters (option C). KMS automatic key rotation creates new key material while retaining the old material for decrypting existing ciphertext, so no bulk re-encryption is required (option D). Encryption complements access control rather than replacing it (option E), since authorised callers read plaintext transparently."
 },
 {
  "id": "dea-220",
  "source": "authored",
  "domain": 4,
  "topic": "Privacy by design in pipelines",
  "difficulty": "hard",
  "multi": true,
  "question": "A new pipeline will process customer records containing personal data. Which TWO design choices best reflect privacy by design?",
  "choices": {
   "A": "Collect and propagate only the fields the downstream use case actually requires, dropping the rest at the earliest stage.",
   "B": "Separate direct identifiers into a restricted store and expose only pseudonymised keys in the analytics zone, with re-identification limited to an authorised role.",
   "C": "Ingest every available field in case it becomes useful later, and restrict access afterwards.",
   "D": "Retain all raw personal data indefinitely so any future audit can be satisfied.",
   "E": "Apply access controls only to the consumption zone, since raw and curated zones are internal."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Data minimisation and pseudonymisation are the two core privacy-by-design techniques: collecting only what the use case needs shrinks the exposure surface permanently, and holding direct identifiers separately means the analytics zone works with keys rather than identities. Collecting everything just in case (option C) and retaining it indefinitely (option D) are the opposite of minimisation and storage limitation. Treating internal zones as exempt from access control (option E) ignores that raw zones typically hold the most sensitive data of all."
 }
];

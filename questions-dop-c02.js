/* AWS DOP-C02 question bank — generated, do not edit by hand. */
window.QUESTION_BANKS = window.QUESTION_BANKS || {};
window.QUESTION_BANKS['dop-c02'] = [
 {
  "id": "dop-1",
  "source": "authored",
  "domain": 1,
  "topic": "CodeDeploy blue/green on ECS",
  "difficulty": "medium",
  "multi": false,
  "question": "A company deploys a containerised API to Amazon ECS on AWS Fargate through AWS CodePipeline. The team wants each release to send 10% of production traffic to the new task set for 15 minutes before the remaining traffic shifts. If the new task set returns elevated 5xx errors during that window, the deployment must roll back automatically without human involvement. Which approach meets these requirements?",
  "choices": {
   "A": "Use an ECS rolling update with a minimum healthy percent of 100 and a maximum percent of 110, and configure a CloudWatch alarm on the 5xx metric to page the on-call engineer.",
   "B": "Use the CodeDeploy ECS blue/green deployment type with the CodeDeployDefault.ECSCanary10Percent15Minutes configuration, and add a CloudWatch alarm on ALB 5xx errors to the deployment group so that automatic rollback is triggered on alarm.",
   "C": "Use the CodeDeploy ECS blue/green deployment type with CodeDeployDefault.ECSLinear10PercentEvery1Minute, and add a manual approval action in CodePipeline before the production stage.",
   "D": "Register two ECS services behind weighted target groups and use a Lambda function invoked on a schedule to adjust the target group weights over 15 minutes."
  },
  "answer": [
   "B"
  ],
  "explanation": "ECSCanary10Percent15Minutes is the predefined CodeDeploy configuration that shifts exactly 10% of traffic, waits 15 minutes, then shifts the remainder — precisely the pattern described. Associating a CloudWatch alarm with the deployment group and enabling automatic rollback on alarm gives the unattended rollback. Option A describes a rolling update, which has no canary step and no traffic weighting, and paging an engineer is not automatic rollback. Option C uses a linear configuration that shifts 10% every minute rather than holding at 10% for 15 minutes, and a manual approval reintroduces the human step. Option D rebuilds canary logic by hand with a scheduled Lambda, which is far more operational overhead and still has no rollback trigger."
 },
 {
  "id": "dop-2",
  "source": "authored",
  "domain": 1,
  "topic": "Cross-account CodePipeline",
  "difficulty": "hard",
  "multi": true,
  "question": "A pipeline runs in a tooling account and must deploy a CloudFormation stack into a separate production account. The pipeline currently fails in the deploy stage with an access denied error when it attempts to read the input artifact from the artifact bucket. Which TWO configuration changes are required for the cross-account deployment to succeed?",
  "choices": {
   "A": "Encrypt the CodePipeline artifact bucket with a customer managed AWS KMS key and grant the production account role kms:Decrypt and kms:DescribeKey permissions on that key.",
   "B": "Enable versioning on the artifact bucket and set the bucket ACL to public-read so the production account can retrieve the artifact.",
   "C": "Create a deployment role in the production account that the pipeline assumes, and add its ARN to the pipeline action configuration, with the tooling account allowed in the role trust policy.",
   "D": "Move the CodePipeline artifact store into the production account so no cross-account access is required.",
   "E": "Replace the CloudFormation deploy action with a CodeBuild action that runs the AWS CLI with static production account access keys stored as environment variables."
  },
  "answer": [
   "A",
   "C"
  ],
  "explanation": "Cross-account CodePipeline has two access hurdles. First, artifacts are encrypted at rest — the default S3 managed key cannot be shared across accounts, so the artifact bucket must use a customer managed KMS key whose key policy grants the remote role kms:Decrypt and kms:DescribeKey; without this the deploy action fails reading the artifact, which is the symptom described. Second, the pipeline action needs a role in the target account to assume, declared on the action and trusting the tooling account. Option B is wrong and dangerous: a public ACL exposes build artifacts to the internet and still does not solve the KMS problem. Option D breaks the other accounts the pipeline serves and does not remove the need for a cross-account role. Option E replaces a managed integration with long-lived static credentials, which is both more overhead and a security regression."
 },
 {
  "id": "dop-3",
  "source": "authored",
  "domain": 1,
  "topic": "CodeBuild caching",
  "difficulty": "medium",
  "multi": false,
  "question": "A Java build in AWS CodeBuild takes 14 minutes, and roughly 9 minutes of that is Maven downloading the same dependencies on every run. The team wants to cut build time with the least ongoing maintenance. What should a DevOps engineer do?",
  "choices": {
   "A": "Configure an S3 cache in the CodeBuild project and declare the local Maven repository directory in the cache paths section of the buildspec.",
   "B": "Increase the CodeBuild compute type to a larger instance so the downloads complete faster.",
   "C": "Commit the contents of the local Maven repository into the source repository so the dependencies arrive with the checkout.",
   "D": "Move the build to an EC2 instance running Jenkins with an EBS volume that persists the Maven repository between jobs."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodeBuild supports caching to S3 or a local cache, with the directories to preserve listed under the cache paths key in the buildspec. Caching the Maven repository means dependencies are downloaded once and restored on later builds, which directly removes the repeated download time and requires no ongoing work. Option B spends money on CPU when the bottleneck is network and repetition, so the same downloads still happen. Option C bloats the repository, makes dependency updates a source-control event, and is a well-known anti-pattern. Option D abandons the managed service and takes on patching and scaling of a Jenkins host to solve a problem CodeBuild already solves natively."
 },
 {
  "id": "dop-4",
  "source": "authored",
  "domain": 1,
  "topic": "Pipeline approval gates",
  "difficulty": "easy",
  "multi": false,
  "question": "A regulated company requires that a named release manager explicitly authorises every production deployment, and that the authorisation is auditable. The delivery pipeline is built with AWS CodePipeline. Which implementation satisfies the requirement with the least custom code?",
  "choices": {
   "A": "Add a manual approval action to the stage preceding production, configure it to publish to an SNS topic the release managers subscribe to, and rely on AWS CloudTrail records of the PutApprovalResult API call for the audit trail.",
   "B": "Disable the pipeline transition into the production stage and have the release manager enable it by hand each release.",
   "C": "Add a CodeBuild action that pauses by polling an Amazon DynamoDB table until a release manager writes an approval item.",
   "D": "Send an email from a Lambda function at the end of the staging stage and instruct release managers to reply before the pipeline continues."
  },
  "answer": [
   "A"
  ],
  "explanation": "The manual approval action is the built-in mechanism for exactly this: it halts the pipeline, optionally notifies an SNS topic, captures an approver comment, and records the decision through the PutApprovalResult API call, which CloudTrail logs with the identity of the approver. That gives both the gate and the audit trail with no code. Option B works mechanically but records nothing about who approved and why, and manual transition toggling is error prone. Option C builds a polling gate by hand, burning build minutes and adding a table to maintain. Option D has no gate at all — nothing in the pipeline waits for or reads the email reply."
 },
 {
  "id": "dop-5",
  "source": "authored",
  "domain": 1,
  "topic": "Lambda traffic shifting with CodeDeploy",
  "difficulty": "hard",
  "multi": false,
  "question": "A serverless application publishes a new AWS Lambda function version on every release. The team wants traffic moved from the old version to the new one in 10% increments every minute, and wants an automated smoke test to run against the new version before any production traffic reaches it. Which configuration meets these requirements?",
  "choices": {
   "A": "Configure a CodeDeploy Lambda deployment group with CodeDeployDefault.LambdaLinear10PercentEvery1Minute and specify a BeforeAllowTraffic hook Lambda function that runs the smoke test.",
   "B": "Configure a CodeDeploy Lambda deployment group with CodeDeployDefault.LambdaCanary10Percent5Minutes and specify an AfterAllowTraffic hook Lambda function that runs the smoke test.",
   "C": "Configure a weighted alias by hand and use a Step Functions state machine to increment the weight every minute after invoking a test function.",
   "D": "Configure provisioned concurrency on the new version and use Amazon Route 53 weighted routing to shift traffic to the new function URL over ten minutes."
  },
  "answer": [
   "A"
  ],
  "explanation": "LambdaLinear10PercentEvery1Minute is the predefined configuration that shifts 10% of traffic per minute, matching the stated increment and interval. The BeforeAllowTraffic lifecycle hook runs after the new version is deployed but before the alias starts routing production traffic to it, which is exactly where a pre-traffic smoke test belongs; a failing hook aborts the deployment. Option B uses a canary configuration rather than linear and puts the test in AfterAllowTraffic, which runs only once all traffic has already shifted. Option C reimplements CodeDeploy in Step Functions for no benefit. Option D confuses concurrency provisioning with traffic shifting, and Route 53 weighting over function URLs is not how alias-based Lambda deployments work."
 },
 {
  "id": "dop-6",
  "source": "authored",
  "domain": 1,
  "topic": "CodePipeline source integrations",
  "difficulty": "medium",
  "multi": false,
  "question": "A development team keeps its application source in a GitHub repository and wants AWS CodePipeline to start a new execution as soon as a commit lands on the main branch. The solution must avoid storing personal access tokens in the pipeline definition and must not poll the repository. What should a DevOps engineer configure?",
  "choices": {
   "A": "Create an AWS CodeConnections connection to GitHub and use it in a CodeStarSourceConnection source action, which registers a webhook for push events on the branch.",
   "B": "Configure the source action to poll for changes every minute using a GitHub personal access token stored in AWS Secrets Manager.",
   "C": "Create a GitHub Actions workflow that copies the repository contents into an S3 bucket, and use an S3 source action with event notifications.",
   "D": "Mirror the GitHub repository into AWS CodeCommit on a schedule with a Lambda function and use a CodeCommit source action."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS CodeConnections (formerly CodeStar Connections) provides an OAuth-based handshake with GitHub that CodePipeline references through the CodeStarSourceConnection action type. AWS manages the credential — no token lives in the pipeline definition — and the integration installs a webhook so executions begin on push rather than on a polling interval. Option B fails both constraints: it polls, and it depends on a personal access token. Option C introduces an unnecessary copy step and loses commit metadata, adding latency and a second system to maintain. Option D adds a scheduled mirror, which is polling by another name and delays the pipeline by the schedule interval."
 },
 {
  "id": "dop-7",
  "source": "authored",
  "domain": 1,
  "topic": "CodeBuild in a VPC",
  "difficulty": "medium",
  "multi": false,
  "question": "Integration tests in an AWS CodeBuild project must query an Amazon RDS instance that is only reachable from private subnets in a VPC. The build also needs to download packages from a public package registry. Which configuration allows both?",
  "choices": {
   "A": "Configure the CodeBuild project with the VPC, private subnets and a security group allowed by the RDS security group, and ensure the private subnets route outbound traffic through a NAT gateway.",
   "B": "Configure the CodeBuild project with the VPC and public subnets, and assign an Elastic IP address to the build container.",
   "C": "Leave the CodeBuild project outside the VPC and make the RDS instance publicly accessible with a security group restricted to the AWS CodeBuild service IP ranges.",
   "D": "Configure the CodeBuild project with the VPC and private subnets, and rely on the default VPC endpoint for internet access."
  },
  "answer": [
   "A"
  ],
  "explanation": "A CodeBuild project placed in a VPC attaches an elastic network interface in the subnets you nominate, so it needs private subnets whose security group is permitted by the database security group. Because those build ENIs have no public IP, outbound internet access for the package registry must come from a NAT gateway in an associated public subnet. Option B is wrong because CodeBuild ENIs in a VPC cannot be assigned Elastic IP addresses, and public subnet placement alone does not give them internet access. Option C exposes a production database to the internet and depends on volatile service IP ranges. Option D invents a default VPC endpoint that gives general internet access — gateway and interface endpoints reach specific AWS services, not arbitrary public registries."
 },
 {
  "id": "dop-8",
  "source": "authored",
  "domain": 1,
  "topic": "CodeArtifact",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants a single internal npm registry that serves both its own private packages and packages from the public npm registry, so that builds have one endpoint to configure and public packages are cached after first use. Which solution meets these requirements?",
  "choices": {
   "A": "Create an AWS CodeArtifact repository for internal packages and attach an upstream repository that is associated with the npmjs public external connection.",
   "B": "Create two AWS CodeArtifact domains and configure builds to fall back to the public registry when a package is missing.",
   "C": "Host a Verdaccio registry on an EC2 Auto Scaling group behind an internal Application Load Balancer.",
   "D": "Store packages as tarballs in an S3 bucket and use a presigned URL in the npm configuration."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodeArtifact repositories can declare upstream repositories, and a repository with an external connection to npmjs will fetch a public package on first request, store a copy, and serve that copy on later requests. Pointing builds at the downstream internal repository therefore gives one endpoint that resolves both private and public packages, with caching built in. Option B misuses domains, which are a grouping and shared-storage construct rather than a resolution chain, and a client-side fallback means two endpoints. Option C achieves the goal but adds a self-managed registry to patch, scale and back up. Option D is not an npm registry at all — npm cannot resolve dependency metadata from a bucket of tarballs behind presigned URLs."
 },
 {
  "id": "dop-9",
  "source": "authored",
  "domain": 1,
  "topic": "CodeDeploy lifecycle hooks",
  "difficulty": "hard",
  "multi": false,
  "question": "An application deployed to EC2 instances with AWS CodeDeploy must stop the running service before new files are copied onto the instance, and must run a health verification script after the service restarts but before the instance is returned to the load balancer. Which appspec.yml lifecycle hooks should be used, in that order?",
  "choices": {
   "A": "ApplicationStop, then ValidateService",
   "B": "BeforeInstall, then AfterAllowTraffic",
   "C": "BeforeBlockTraffic, then AfterInstall",
   "D": "DownloadBundle, then BeforeAllowTraffic"
  },
  "answer": [
   "A"
  ],
  "explanation": "In the EC2/on-premises lifecycle, ApplicationStop runs first — before the new revision is even downloaded — which is where a service is shut down cleanly. ValidateService is the final hook, running after ApplicationStart and, in a load-balanced deployment, before the instance is placed back in service, which is where health verification belongs. Option B is close but BeforeInstall runs after the bundle is downloaded rather than before the service stops, and AfterAllowTraffic runs once traffic is already flowing. Option C reverses the order and BeforeBlockTraffic concerns removing an instance from the load balancer, not stopping the application. Option D is invalid for scripting because DownloadBundle and BeforeAllowTraffic are reserved for the CodeDeploy agent and the load-balancing phase respectively, and cannot host an application stop."
 },
 {
  "id": "dop-10",
  "source": "authored",
  "domain": 1,
  "topic": "Parallel pipeline actions",
  "difficulty": "easy",
  "multi": false,
  "question": "A CodePipeline test stage runs unit tests, a static analysis scan and a licence check as three separate CodeBuild actions. They currently execute one after another, and the stage takes 18 minutes. The three checks do not depend on one another. How can the stage duration be reduced?",
  "choices": {
   "A": "Assign all three actions the same runOrder value within the stage so CodePipeline runs them in parallel.",
   "B": "Move each action into its own stage so the stages run concurrently.",
   "C": "Combine all three checks into a single CodeBuild action and enable the build badge.",
   "D": "Enable a local cache on each CodeBuild project so the actions overlap."
  },
  "answer": [
   "A"
  ],
  "explanation": "Within a CodePipeline stage, actions that share the same runOrder start together and the stage completes when the slowest finishes, so giving the three independent checks an identical runOrder turns 18 minutes of serial work into roughly the duration of the longest check. Option B is backwards: stages always run in sequence, so splitting them out guarantees serial execution. Option C keeps the work serial inside one build and a badge is only a status image. Option D speeds up individual builds through dependency caching but does nothing to make actions run concurrently."
 },
 {
  "id": "dop-11",
  "source": "authored",
  "domain": 1,
  "topic": "Build secrets handling",
  "difficulty": "medium",
  "multi": false,
  "question": "A CodeBuild project needs a third-party API key at build time. Security requires that the key never appear in the build specification, in the project definition, or in CloudWatch build logs. What should a DevOps engineer do?",
  "choices": {
   "A": "Store the key in AWS Secrets Manager and reference it in the buildspec env section using the secrets-manager key, granting the CodeBuild service role permission to read that secret.",
   "B": "Store the key as a plaintext environment variable of type PLAINTEXT in the CodeBuild project configuration.",
   "C": "Encrypt the key with AWS KMS, commit the ciphertext to the repository, and decrypt it in the install phase with an echo of the result for verification.",
   "D": "Pass the key as a CodePipeline action configuration parameter so it is only present at execution time."
  },
  "answer": [
   "A"
  ],
  "explanation": "The buildspec env block supports secrets-manager and parameter-store sources, which resolve the value at build start into an environment variable without the secret ever being written into the buildspec or the project definition, and CodeBuild masks these resolved values in log output. The service role simply needs secretsmanager:GetSecretValue on the secret. Option B stores the secret in the project definition in clear text, visible to anyone with read access to the project. Option C puts ciphertext in source control and then explicitly echoes the decrypted value into the build log, defeating the requirement. Option D still records the value in the pipeline definition, which is readable through the CodePipeline API."
 },
 {
  "id": "dop-12",
  "source": "authored",
  "domain": 1,
  "topic": "EventBridge pipeline triggers",
  "difficulty": "medium",
  "multi": false,
  "question": "A base container image is rebuilt weekly and pushed to Amazon ECR with the tag stable. Several downstream application pipelines must start automatically whenever that specific tag is updated. Which solution meets the requirement most efficiently?",
  "choices": {
   "A": "Create an Amazon EventBridge rule matching the ECR Image Action Push event with a detail filter on the repository name and image tag, and add each application pipeline as a target.",
   "B": "Configure each application pipeline with a source action that polls the ECR repository every five minutes.",
   "C": "Add a step to the base image build that calls StartPipelineExecution for each downstream pipeline using the AWS CLI.",
   "D": "Create an Amazon EventBridge scheduled rule that starts every application pipeline once a week, timed to run after the base image build."
  },
  "answer": [
   "A"
  ],
  "explanation": "ECR emits an ECR Image Action event on push, and the event detail carries the repository name, action type and image tag, so a single EventBridge rule can match precisely the stable tag in the right repository and fan out to every pipeline target. Nothing needs to change in the pipelines themselves, and adding a consumer means adding a target. Option B polls, which wastes calls and delays the trigger. Option C couples the base image build to a hardcoded list of downstream pipelines, so every new consumer requires editing the producer. Option D fires on a clock rather than on the actual push, so it runs even when the build failed and drifts whenever the build takes longer than expected."
 },
 {
  "id": "dop-13",
  "source": "authored",
  "domain": 1,
  "topic": "CodeDeploy blue/green on EC2",
  "difficulty": "hard",
  "multi": false,
  "question": "A company runs an application on an EC2 Auto Scaling group behind an Application Load Balancer. Releases must bring up an entirely new fleet, shift traffic only once the new fleet passes load balancer health checks, and keep the previous fleet running for one hour so a rollback is instant. Which CodeDeploy setup meets these requirements?",
  "choices": {
   "A": "A blue/green deployment group that provisions a replacement Auto Scaling group by copying the original, with the original instances terminated on a one-hour wait after a successful deployment.",
   "B": "An in-place deployment group with the OneAtATime configuration and automatic rollback enabled on deployment failure.",
   "C": "A blue/green deployment group configured to terminate the original instances immediately after traffic is rerouted.",
   "D": "An in-place deployment group with the HalfAtATime configuration and a BeforeAllowTraffic hook that sleeps for one hour."
  },
  "answer": [
   "A"
  ],
  "explanation": "A CodeDeploy blue/green deployment group for EC2 can copy the existing Auto Scaling group to create a replacement fleet, register it with the load balancer, wait for health checks, then reroute traffic. The original instances setting controls what happens to the blue fleet afterwards: choosing to terminate after a specified wait time keeps them running for that interval so rollback is an immediate traffic reroute rather than a redeploy. One hour is exactly this setting. Option B replaces software on the existing instances, so there is no second fleet and rollback means another deployment. Option C uses the right deployment type but discards the rollback window by terminating immediately. Option D is an in-place strategy and a sleeping hook merely stalls the deployment while consuming a deployment slot."
 },
 {
  "id": "dop-14",
  "source": "authored",
  "domain": 1,
  "topic": "CodeBuild test reporting",
  "difficulty": "easy",
  "multi": false,
  "question": "A team wants pass and fail counts, trends and individual failing test names for their JUnit suite to be visible in the AWS console after every CodeBuild run, without building a dashboard. What should they configure?",
  "choices": {
   "A": "Add a reports section to the buildspec that declares the JUnit XML output path and file format, so CodeBuild creates a test report group.",
   "B": "Publish the test output to CloudWatch Logs and build a Logs Insights query saved to a dashboard.",
   "C": "Upload the JUnit XML files as build artifacts to S3 and open them from the console.",
   "D": "Emit a custom CloudWatch metric for each failing test from a post_build command."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodeBuild has a native test reporting feature: declaring a reports section in the buildspec with the report group name, the files to collect and a supported format such as JUNITXML makes CodeBuild parse the results and present pass and fail counts, durations, failing test names and a trend across runs in the console. Option B requires building and maintaining the queries and still parses text rather than structured results. Option C stores raw XML that a human must download and read. Option D loses the individual test detail, since a metric carries a number rather than test names, and requires custom scripting."
 },
 {
  "id": "dop-15",
  "source": "authored",
  "domain": 1,
  "topic": "Artifact promotion between environments",
  "difficulty": "medium",
  "multi": false,
  "question": "An organisation requires that the exact binary tested in staging is the binary deployed to production, with no rebuild between environments. The pipeline currently has a separate CodeBuild action in the production stage that compiles the source again. What is the correct change?",
  "choices": {
   "A": "Remove the production build action and have the production deploy action consume the output artifact produced by the single build action earlier in the pipeline.",
   "B": "Pin the production build action to the same source commit ID so the rebuild is reproducible.",
   "C": "Add a checksum comparison step that fails the pipeline if the two builds produce different artifacts.",
   "D": "Configure both build actions to use the same CodeBuild project and cache so the outputs match."
  },
  "answer": [
   "A"
  ],
  "explanation": "Build once, deploy many is the standard practice the requirement describes: a single build action produces an output artifact that later stages take as their input artifact, so staging and production receive byte-identical bits. Option B still rebuilds, and rebuilding from the same commit does not guarantee an identical binary because toolchain versions, timestamps and dependency resolution can all move. Option C detects the divergence the design should prevent, and would turn ordinary non-determinism into pipeline failures. Option D shares configuration but still runs the compiler twice, so the guarantee is never actually made."
 },
 {
  "id": "dop-16",
  "source": "authored",
  "domain": 1,
  "topic": "Pipeline variables and dynamic configuration",
  "difficulty": "medium",
  "multi": false,
  "question": "A CodePipeline deploy action must pass the image tag produced by an earlier CodeBuild action into a CloudFormation parameter. Which mechanism passes the value between the actions natively?",
  "choices": {
   "A": "Export the value as a CodeBuild exported environment variable, then reference it in the deploy action configuration as a pipeline variable using the namespace of the build action.",
   "B": "Write the value to an SSM Parameter Store parameter in the build and use a dynamic reference in the CloudFormation template.",
   "C": "Write the value into a file in the output artifact and have the deploy action read the file directly as a parameter.",
   "D": "Store the value in a DynamoDB table keyed on the pipeline execution ID and look it up from a custom resource."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodeBuild can declare exported-variables in its buildspec, and when the build action is given a namespace, CodePipeline exposes those values as variables that later action configurations reference with the hash-brace syntax. This is the built-in mechanism for passing a value such as an image tag forward. Option B works but leaves state outside the execution, so concurrent executions overwrite one another and the deployed tag may not be the one this run built. Option C is close to the CloudFormation template configuration file pattern but a raw value file is not read as a parameter automatically. Option D builds a bespoke handoff with a table and a custom resource where a first-class feature exists."
 },
 {
  "id": "dop-17",
  "source": "authored",
  "domain": 1,
  "topic": "Deployment strategy selection",
  "difficulty": "medium",
  "multi": false,
  "question": "A stateful application performs a schema migration that is not backward compatible with the previous application version. The team is choosing a deployment strategy. Which consideration should drive the decision?",
  "choices": {
   "A": "Blue/green and canary strategies both run two application versions against the same database simultaneously, so the migration must first be made backward compatible, typically by splitting it into expand and contract steps across two releases.",
   "B": "Blue/green is safe because the green fleet uses a separate database that is promoted at cutover.",
   "C": "Canary is safe because only 10% of traffic reaches the new schema at any time.",
   "D": "An in-place rolling deployment avoids the problem because all instances are updated at once."
  },
  "answer": [
   "A"
  ],
  "explanation": "The defining constraint is that progressive strategies deliberately keep old and new application code serving traffic at the same time, and both talk to the same database. A migration that the old code cannot tolerate will break the old version the moment it runs, so the schema change must be decomposed: an expand release adds the new structures in a backward-compatible way, and a later contract release removes the old ones once no running code depends on them. Option B assumes a database clone and promotion that would lose writes taken by blue during the deployment. Option C misses that the 10% share applies to traffic, not to the single shared schema, which changes for everyone at once. Option D is wrong on its own terms, because rolling deployments update instances in batches and therefore also run mixed versions."
 },
 {
  "id": "dop-18",
  "source": "authored",
  "domain": 1,
  "topic": "CodeBuild batch builds",
  "difficulty": "medium",
  "multi": false,
  "question": "A build must produce container images for both x86_64 and arm64 architectures and then publish a single multi-architecture manifest. The team wants the two architecture builds to run concurrently in AWS CodeBuild and a final step to combine them. Which capability should be used?",
  "choices": {
   "A": "A CodeBuild batch build using a build graph, with one build per architecture and a final build that depends on both and pushes the manifest.",
   "B": "Two independent CodeBuild projects triggered by the same EventBridge rule, with the manifest pushed by whichever finishes last.",
   "C": "A single CodeBuild project using QEMU emulation to build both architectures sequentially in one job.",
   "D": "A CodeBuild project with two build phases in the buildspec, one per architecture."
  },
  "answer": [
   "A"
  ],
  "explanation": "Batch builds let one CodeBuild project fan out into several coordinated builds, and the build graph form adds explicit dependencies, so the two architecture builds run in parallel on their respective compute types and a third build runs only once both succeed — the natural place to create and push the multi-architecture manifest. Option B has no join point, and having a build detect that it finished last is a race condition. Option C works but emulation is slow and the builds are serial, which is what the team is trying to avoid. Option D is wrong because buildspec phases run sequentially within a single build, so there is no concurrency and no separate native runtime."
 },
 {
  "id": "dop-19",
  "source": "authored",
  "domain": 1,
  "topic": "Rollback on deployment metrics",
  "difficulty": "medium",
  "multi": true,
  "question": "A DevOps engineer must ensure an AWS CodeDeploy deployment reverts automatically when either the deployment itself fails or application error rates spike shortly after the new revision goes live. Which TWO settings should be configured on the deployment group?",
  "choices": {
   "A": "Enable automatic rollback when a deployment fails.",
   "B": "Enable automatic rollback when a deployment is stopped by a user.",
   "C": "Associate one or more CloudWatch alarms with the deployment group and enable rollback when an alarm threshold is met.",
   "D": "Set the deployment configuration to AllAtOnce so failures surface immediately.",
   "E": "Enable the ignore alarm configuration option so deployments proceed if alarm data is missing."
  },
  "answer": [
   "A",
   "C"
  ],
  "explanation": "CodeDeploy deployment groups expose rollback triggers as checkboxes: rolling back when the deployment fails covers lifecycle and health-check failures, and associating CloudWatch alarms with the group plus rolling back when an alarm threshold is met covers the application-level error spike. Together they satisfy both halves of the requirement. Option B addresses user-initiated stops, which is not what was asked. Option D makes failures more damaging rather than better handled, because AllAtOnce updates every instance simultaneously. Option E does the opposite of what is wanted: it tells CodeDeploy to continue when alarm data is unavailable, weakening the very guard being configured."
 },
 {
  "id": "dop-20",
  "source": "authored",
  "domain": 1,
  "topic": "Pipeline performance",
  "difficulty": "medium",
  "multi": false,
  "question": "A pipeline runs a full end-to-end regression suite that takes 45 minutes on every commit to a feature branch, and developers complain about feedback latency. The team still requires the full suite before production. What is the most appropriate change?",
  "choices": {
   "A": "Run fast unit and lint checks on feature-branch commits, and run the full regression suite only in the pipeline that deploys to staging and production.",
   "B": "Reduce the regression suite to the tests that failed most recently.",
   "C": "Increase the CodeBuild compute type for the regression suite so it completes faster.",
   "D": "Run the regression suite on a nightly schedule instead of in the pipeline."
  },
  "answer": [
   "A"
  ],
  "explanation": "The requirement is fast feedback on feature branches while keeping full coverage before production, which is the classic test pyramid split across triggers: cheap, fast checks run on every commit, and the expensive suite runs on the path that leads to a release. Nothing is lost because the full suite still gates production. Option B silently reduces coverage and the failure history is a poor predictor of the next regression. Option C may shave minutes but does not change the structural problem and costs more per run. Option D removes the suite from the release path entirely, so a broken build can reach production and only be discovered overnight."
 },
 {
  "id": "dop-21",
  "source": "authored",
  "domain": 1,
  "topic": "Immutable AMI pipelines",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants a golden AMI produced every month that includes the latest operating system patches, an approved agent set, and a hardening baseline, with the resulting image tested and then shared with several member accounts. Which AWS service is purpose-built for this pipeline?",
  "choices": {
   "A": "EC2 Image Builder, using an image pipeline with a build component set, a test component set, and a distribution configuration that shares the AMI with the target accounts.",
   "B": "AWS Systems Manager Patch Manager, running a monthly patch baseline against a template instance and creating an AMI with a maintenance window task.",
   "C": "AWS Backup, with a monthly plan that copies an EC2 instance backup to the member accounts.",
   "D": "AWS Service Catalog, with a product version created each month from a CloudFormation template."
  },
  "answer": [
   "A"
  ],
  "explanation": "EC2 Image Builder exists for exactly this lifecycle: an image recipe composes a parent image with build components for patching, agents and hardening, test components validate the result, a schedule drives monthly execution, and the distribution configuration copies the AMI to target Regions and shares it with named accounts. Option B can patch and snapshot but leaves the orchestration, testing and cross-account distribution as custom work. Option C protects data rather than producing machine images and does not run build or test steps. Option D distributes provisioning products, not AMIs, and would still need something else to actually build the image."
 },
 {
  "id": "dop-22",
  "source": "authored",
  "domain": 1,
  "topic": "CloudFormation deployment actions in CodePipeline",
  "difficulty": "hard",
  "multi": false,
  "question": "A pipeline deploys infrastructure with CloudFormation. Auditors require that the exact set of resource changes is reviewed and approved by a human before it is applied to production. Which pipeline design satisfies this?",
  "choices": {
   "A": "A CloudFormation action with the CREATE_UPDATE mode, followed by a manual approval action, followed by a second CloudFormation action that deletes the stack on rejection.",
   "B": "A CloudFormation action with the CHANGE_SET_REPLACE mode, followed by a manual approval action, followed by a CloudFormation action with the CHANGE_SET_EXECUTE mode.",
   "C": "A CloudFormation action with the CREATE_UPDATE mode and drift detection enabled, followed by a manual approval action.",
   "D": "A manual approval action followed by a CloudFormation action with the REPLACE_ON_FAILURE mode."
  },
  "answer": [
   "B"
  ],
  "explanation": "CHANGE_SET_REPLACE creates or replaces a change set without touching the stack, so the reviewer can inspect precisely which resources would be added, modified or replaced. The manual approval then gates the CHANGE_SET_EXECUTE action, which applies that reviewed change set. This is the standard three-action review pattern. Option A applies the changes first and only then asks for approval, and deleting the stack is a catastrophic way to undo an update. Option C likewise deploys before the human sees anything; drift detection reports divergence from the template rather than previewing a pending change. Option D asks for approval before any change set exists, so the approver has nothing concrete to review."
 },
 {
  "id": "dop-23",
  "source": "authored",
  "domain": 1,
  "topic": "Monorepo pipeline triggers",
  "difficulty": "hard",
  "multi": false,
  "question": "Three microservices live in a single repository, each in its own directory. Today any commit rebuilds and redeploys all three. The team wants only the services whose files changed to be built. Which approach requires the least custom orchestration?",
  "choices": {
   "A": "Define separate CodePipeline pipelines per service and configure each source action with a trigger filter on the file paths belonging to that service.",
   "B": "Keep one pipeline and add a CodeBuild action that inspects the git diff and calls StopPipelineExecution when its service is unchanged.",
   "C": "Split the repository into three repositories so each pipeline has an independent source.",
   "D": "Keep one pipeline and have each deploy action compare artifact checksums against the currently deployed version before acting."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodePipeline source triggers support filters, including file path include and exclude patterns, so a pipeline per service can start only when files under that service's directory change. It is configuration rather than code and each service keeps an independent release cadence. Option B still starts every pipeline execution and burns build minutes to decide to do nothing, and stopping an execution mid-flight leaves a confusing history of aborted runs. Option C solves the problem but is a large repository migration, which is far more disruptive than adding a trigger filter. Option D performs the deployment decision at the very end of the pipeline, after all the build work has already been paid for."
 },
 {
  "id": "dop-24",
  "source": "authored",
  "domain": 1,
  "topic": "Elastic Beanstalk deployment policies",
  "difficulty": "medium",
  "multi": false,
  "question": "An AWS Elastic Beanstalk web environment must be updated with zero reduction in capacity and no risk of the new version running on partially updated instances. The team accepts a longer deployment and additional temporary cost. Which deployment policy should be selected?",
  "choices": {
   "A": "Immutable, which launches a new Auto Scaling group with the new version and terminates the original instances only after the new ones pass health checks.",
   "B": "Rolling with additional batch, which adds one batch of instances and updates the remaining instances in place.",
   "C": "All at once, which updates every instance simultaneously to minimise the deployment window.",
   "D": "Rolling, which updates instances in batches without reducing total capacity."
  },
  "answer": [
   "A"
  ],
  "explanation": "The immutable policy provisions an entirely new set of instances in a temporary Auto Scaling group, runs the new version there, and only merges them in and terminates the originals once they are healthy. Nothing is updated in place, so capacity never drops and a failure leaves the original instances untouched, which is the strongest guarantee among the policies at the cost of time and temporary double capacity. Option B preserves capacity but still updates the original instances in place, so a failed batch leaves a mixed fleet. Option C takes the whole environment down to update it. Option D reduces capacity while a batch is out of service, which the requirement forbids."
 },
 {
  "id": "dop-25",
  "source": "authored",
  "domain": 1,
  "topic": "Pipeline notifications",
  "difficulty": "easy",
  "multi": false,
  "question": "A DevOps team wants a message posted to a chat channel whenever a CodePipeline execution fails, and wants to avoid writing and maintaining a Lambda function for the integration. What should they use?",
  "choices": {
   "A": "An AWS CodeStar Notifications rule on the pipeline for failure events, delivered through AWS Chatbot to the chat channel.",
   "B": "A CloudWatch alarm on the pipeline execution metric with an SNS email subscription forwarded to the channel.",
   "C": "An EventBridge rule with a Lambda target that formats the message and calls the chat webhook.",
   "D": "A CodeBuild action at the end of the pipeline that posts to the chat webhook with curl."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodeStar Notifications attaches directly to a pipeline, lets you pick the event types such as execution failed, and delivers through an SNS topic that AWS Chatbot renders into Slack or Amazon Chime — no code to write or maintain. Option B relies on email forwarding, which is fragile and loses the structured detail. Option C is a working design but is precisely the Lambda function the team wants to avoid owning. Option D only runs when the pipeline reaches that final action, which by definition does not happen when an earlier stage fails."
 },
 {
  "id": "dop-26",
  "source": "authored",
  "domain": 1,
  "topic": "CodePipeline execution modes",
  "difficulty": "hard",
  "multi": false,
  "question": "A busy repository receives several commits per hour. The team finds that CodePipeline sometimes skips intermediate commits: a later execution overtakes an earlier one waiting to enter a stage, and the earlier one is discarded. They want every commit to be built and deployed in order. What should they configure?",
  "choices": {
   "A": "Change the pipeline execution mode from SUPERSEDED to QUEUED so executions wait their turn and none are discarded.",
   "B": "Change the pipeline execution mode to PARALLEL so every commit is processed independently.",
   "C": "Disable the stage transition into the deploy stage so executions accumulate.",
   "D": "Add a manual approval action so a human decides which commit proceeds."
  },
  "answer": [
   "A"
  ],
  "explanation": "SUPERSEDED is the default execution mode, and it is what causes the described behaviour: a newer execution waiting at a stage boundary replaces the older one, which is then marked superseded and never completes. QUEUED mode makes executions wait in order and run one at a time, so every commit is processed in sequence. Option B processes every commit but concurrently, so deployment order is not preserved and two executions can deploy to the same target at once. Option C stops the pipeline rather than ordering it, and the executions still supersede one another. Option D introduces a human into every commit without changing the superseding behaviour at all."
 },
 {
  "id": "dop-27",
  "source": "authored",
  "domain": 1,
  "topic": "Container image scanning gate",
  "difficulty": "medium",
  "multi": false,
  "question": "A pipeline pushes container images to Amazon ECR. Security requires that an image with a CRITICAL vulnerability must never be deployed, and the check must happen before the deploy stage runs. Which design meets this?",
  "choices": {
   "A": "Enable enhanced scanning on the ECR repository, and add a pipeline action that calls DescribeImageScanFindings for the pushed digest and fails the action when critical findings are present.",
   "B": "Enable scan on push for the repository and configure an ECR lifecycle policy to expire images that have critical findings.",
   "C": "Subscribe to Amazon Inspector findings through EventBridge and send an email to the security team when a critical finding appears.",
   "D": "Configure the deploy action to retry three times, on the assumption that a vulnerable image will fail its health checks."
  },
  "answer": [
   "A"
  ],
  "explanation": "The requirement is a hard gate inside the pipeline, so the pipeline itself must inspect the result and fail. Scanning the image and then querying DescribeImageScanFindings for that specific digest, failing the action when severity counts include CRITICAL, blocks the execution before it reaches deploy. Option B misuses lifecycle policies, which expire images by age or count and cannot filter on scan findings; even if they could, expiry is asynchronous and would not gate this execution. Option C notifies after the fact and never stops the deployment. Option D is not a security control at all — a vulnerable image is usually perfectly healthy."
 },
 {
  "id": "dop-28",
  "source": "authored",
  "domain": 1,
  "topic": "AWS SAM deployments",
  "difficulty": "medium",
  "multi": false,
  "question": "A serverless team uses AWS SAM. They want the sam deploy step in CodeBuild to produce a reviewable change set rather than applying changes immediately, so the pipeline can gate on approval. Which command form should the buildspec use?",
  "choices": {
   "A": "sam deploy with the --no-execute-changeset flag, so the change set is created and its ARN returned for a later execute step.",
   "B": "sam deploy with the --force-upload flag, so artifacts are refreshed before the stack updates.",
   "C": "sam build followed by sam local invoke, so the function is validated before deployment.",
   "D": "sam deploy with the --resolve-s3 flag, so SAM manages the artifact bucket automatically."
  },
  "answer": [
   "A"
  ],
  "explanation": "sam deploy normally creates and immediately executes a change set. Passing --no-execute-changeset stops after creation and prints the change set, so the pipeline can present it for approval and execute it in a later action. Option B controls whether artifacts are re-uploaded even when unchanged, which has nothing to do with gating. Option C runs the function locally in a container for development testing and performs no deployment. Option D only decides where the packaged artifacts are stored, and the stack would still be updated immediately."
 },
 {
  "id": "dop-29",
  "source": "authored",
  "domain": 1,
  "topic": "Cross-region deployments",
  "difficulty": "hard",
  "multi": false,
  "question": "A pipeline in us-east-1 must deploy the same CloudFormation stack to eu-west-1 and ap-southeast-2. The team wants to keep one pipeline. What is required for the cross-Region deploy actions to work?",
  "choices": {
   "A": "An artifact store in each target Region, declared on the pipeline, so CodePipeline can replicate the input artifacts into the Region where each action runs.",
   "B": "A VPC peering connection between the pipeline Region and each target Region so artifacts can be transferred privately.",
   "C": "A separate pipeline per Region, because CodePipeline actions can only operate in the Region hosting the pipeline.",
   "D": "An S3 Cross-Region Replication rule from the primary artifact bucket, with the deploy actions reading from the replica."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodePipeline supports actions in Regions other than the pipeline's own, but each such Region needs its own artifact store declared in the pipeline's artifactStores map. CodePipeline then copies the input artifacts into the correct Regional bucket before running the action. Option B is unnecessary because this is service-to-service traffic over AWS APIs, not VPC networking. Option C is simply false — cross-Region actions are a supported feature. Option D describes manual replication that CodePipeline neither knows about nor waits for, so actions would race the replication and read stale or missing artifacts."
 },
 {
  "id": "dop-30",
  "source": "authored",
  "domain": 1,
  "topic": "Static site deployment",
  "difficulty": "easy",
  "multi": false,
  "question": "A single-page application is hosted in an S3 bucket behind Amazon CloudFront. After each deployment users continue to receive the previous version of index.html for several hours. What should be added to the pipeline?",
  "choices": {
   "A": "A step that creates a CloudFront invalidation for the changed paths after the S3 sync completes.",
   "B": "A step that disables the CloudFront distribution during deployment and re-enables it afterwards.",
   "C": "A change to the S3 bucket policy granting CloudFront read access to the new objects.",
   "D": "A step that increases the CloudFront default TTL so the cache refreshes more predictably."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudFront serves cached objects until their TTL expires, which is why the old index.html persists after the bucket contents change. Creating an invalidation as a pipeline step evicts those paths from the edge caches immediately, so the next request fetches the new object. Option B causes an outage and would still leave the cache populated on re-enable. Option C addresses an access problem that is not occurring, since the old content is being served successfully. Option D makes the problem worse by extending how long stale objects are kept."
 },
 {
  "id": "dop-31",
  "source": "authored",
  "domain": 1,
  "topic": "CodeBuild webhook filters",
  "difficulty": "medium",
  "multi": false,
  "question": "A CodeBuild project is triggered by a webhook from a source repository, but the team wants builds to run only for pull requests targeting the main branch, and never for pushes to any branch. How should this be configured?",
  "choices": {
   "A": "Configure a webhook filter group containing an EVENT filter matching PULL_REQUEST_CREATED and PULL_REQUEST_UPDATED, and a BASE_REF filter matching the main branch.",
   "B": "Configure a webhook filter group with a HEAD_REF filter matching the main branch.",
   "C": "Remove the webhook and configure the CodeBuild project to poll the repository for open pull requests.",
   "D": "Configure two webhooks, one for pull requests and one for pushes, and disable the push webhook in the console."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodeBuild webhook filter groups combine filters with AND semantics inside a group, so an EVENT filter limiting the trigger to pull request creation and update, together with a BASE_REF filter for the main branch, produces exactly the requested behaviour and excludes push events. Option B filters on HEAD_REF, which is the source branch of the pull request rather than its target, so pull requests from a branch named main would match and everything else would not. Option C is not a CodeBuild capability and reintroduces polling. Option D is wrong because a CodeBuild project has a single webhook whose behaviour is controlled by filter groups."
 },
 {
  "id": "dop-32",
  "source": "authored",
  "domain": 1,
  "topic": "Feature flags with AppConfig",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants to decouple releasing code from enabling a feature, so that a new capability can be turned on for a small percentage of users and rolled back within seconds without redeploying. Which AWS service provides this with built-in validation and gradual rollout?",
  "choices": {
   "A": "AWS AppConfig, using a feature flag configuration profile with a deployment strategy that rolls the flag out gradually and monitors CloudWatch alarms for automatic rollback.",
   "B": "AWS Systems Manager Parameter Store, with the application polling a parameter on each request.",
   "C": "Amazon CloudWatch Evidently experiments attached to the CodeDeploy deployment group.",
   "D": "AWS Secrets Manager, with the feature state stored as a secret and rotated to flip the flag."
  },
  "answer": [
   "A"
  ],
  "explanation": "AppConfig is purpose-built for runtime configuration and feature flags: configuration profiles support flag schemas and validators, deployment strategies control how quickly the change propagates to hosts, and alarms can trigger an automatic rollback of the configuration deployment — all without shipping new code. Option B can hold a value but offers no gradual rollout, no validation and no rollback semantics, and per-request polling is expensive. Option C names a real experimentation service but it is not attached to CodeDeploy deployment groups, and the described control is configuration rollout rather than experiment assignment. Option D misuses a secrets store for non-secret configuration and rotation is not a flag mechanism."
 },
 {
  "id": "dop-33",
  "source": "authored",
  "domain": 1,
  "topic": "CodeDeploy agent troubleshooting",
  "difficulty": "medium",
  "multi": true,
  "question": "A CodeDeploy in-place deployment to an EC2 Auto Scaling group fails on newly launched instances with the message that no instances were found in the deployment group, while existing instances deploy successfully. Which TWO causes should a DevOps engineer investigate?",
  "choices": {
   "A": "The new instances are missing the EC2 tags or Auto Scaling group association that the deployment group uses to select targets.",
   "B": "The CodeDeploy agent is not installed or not running on the new instances, so they never register with the service.",
   "C": "The appspec.yml file is missing a ValidateService hook.",
   "D": "The deployment configuration is set to OneAtATime rather than AllAtOnce.",
   "E": "The application revision is stored in an S3 bucket in a different Region from the deployment group."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A deployment group selects instances by tag or by Auto Scaling group membership, so instances launched without the expected tags simply are not part of the group — the first thing to check when the service reports no instances. The second requirement is the CodeDeploy agent: it polls the service and registers the host, so an image or launch template that omits the agent, or a boot failure of the agent service, produces the same symptom. Option C affects what runs during a deployment, not whether instances are discovered, and ValidateService is optional. Option D changes batching, which cannot reduce the target set to zero. Option E would cause an artifact download failure with a different error, after instances had already been found."
 },
 {
  "id": "dop-34",
  "source": "authored",
  "domain": 1,
  "topic": "Database migrations in pipelines",
  "difficulty": "hard",
  "multi": false,
  "question": "A pipeline must apply database migrations to an Amazon Aurora cluster in a private subnet exactly once per release, before the application deploy action runs, and must fail the pipeline if the migration fails. Which implementation is most appropriate?",
  "choices": {
   "A": "A CodeBuild action configured for the VPC and private subnets that runs the migration tool, placed in a stage before the application deploy stage so a non-zero exit fails the pipeline.",
   "B": "A Lambda function invoked by the application on first start that applies pending migrations if it holds a lock.",
   "C": "A CloudFormation custom resource in the application stack that applies migrations during stack update.",
   "D": "An EventBridge rule that runs the migration on a schedule shortly before the usual release window."
  },
  "answer": [
   "A"
  ],
  "explanation": "A CodeBuild action gives a single, ordered, observable execution with VPC access to reach a private Aurora cluster, and a failing migration exits non-zero, which fails the action and therefore the pipeline before any application code is deployed. Option B runs migrations at application start, which means every scaled-out instance races for the lock, migrations happen after the deploy rather than before, and a failure surfaces as a crash loop rather than a pipeline failure. Option C ties schema changes to stack lifecycle, where a failed custom resource triggers a stack rollback that cannot undo the partial schema change. Option D decouples the migration from the release entirely and will eventually run against the wrong application version."
 },
 {
  "id": "dop-35",
  "source": "authored",
  "domain": 1,
  "topic": "CDK pipelines",
  "difficulty": "hard",
  "multi": false,
  "question": "A team uses the AWS CDK and wants the pipeline that deploys their application to update itself automatically when the pipeline definition changes in source control, before deploying the application stages. Which capability provides this?",
  "choices": {
   "A": "A self-mutating CDK pipeline, in which an UpdatePipeline stage runs cdk deploy against the pipeline stack itself before the application stages execute.",
   "B": "A CloudFormation stack policy on the pipeline stack that allows updates from the pipeline role.",
   "C": "A CodePipeline stage that calls UpdatePipeline through the AWS CLI at the end of every successful execution.",
   "D": "Nested stacks, with the pipeline defined as a nested stack of the application stack."
  },
  "answer": [
   "A"
  ],
  "explanation": "CDK Pipelines are self-mutating by design: the generated pipeline contains an UpdatePipeline stage that redeploys the pipeline stack from the newly synthesised assembly, so structural changes such as adding a stage take effect during the same execution and before the application stages run. Option B controls which resources may be modified during a stack update but does not cause an update to occur. Option C updates the pipeline only after everything else has already run using the old definition, so a newly added stage is skipped for that commit. Option D inverts the dependency and gives the pipeline no mechanism to redeploy itself."
 },
 {
  "id": "dop-36",
  "source": "authored",
  "domain": 1,
  "topic": "Buildspec structure",
  "difficulty": "medium",
  "multi": false,
  "question": "A CodeBuild job must always upload diagnostic logs to Amazon S3, even when the test command fails and the build is marked as failed. Where should the upload commands be placed in the buildspec?",
  "choices": {
   "A": "In a finally block within the phase that runs the tests, because finally commands run whether or not the phase commands succeed.",
   "B": "In the post_build phase, because post_build always runs after build regardless of outcome.",
   "C": "In the install phase, because it runs before any failure can occur.",
   "D": "In the artifacts section, using a secondary artifact definition."
  },
  "answer": [
   "A"
  ],
  "explanation": "Each buildspec phase may contain a finally block whose commands execute after the phase's commands, including when one of them failed — this is the documented way to guarantee cleanup or diagnostic collection. Option B is a common misconception: post_build does run after a failed build phase, but if the failure occurs within post_build itself the remaining commands are skipped, and phase-level guarantees are better expressed with finally. Option C runs before the tests, so there are no diagnostics to collect yet. Option D publishes files only on a successful build, which is precisely the case that does not need them."
 },
 {
  "id": "dop-37",
  "source": "authored",
  "domain": 1,
  "topic": "ECS deployment circuit breaker",
  "difficulty": "medium",
  "multi": false,
  "question": "A team uses the ECS rolling update deployment type and wants a failed deployment to stop automatically and return the service to its previous task definition, without adopting CodeDeploy. What should be enabled?",
  "choices": {
   "A": "The ECS deployment circuit breaker with rollback enabled on the service deployment configuration.",
   "B": "A CloudWatch alarm on the service CPU utilisation with an SNS notification to the team.",
   "C": "A minimum healthy percent of 0 so failing tasks are replaced faster.",
   "D": "An Application Auto Scaling target tracking policy on the service."
  },
  "answer": [
   "A"
  ],
  "explanation": "The ECS deployment circuit breaker watches how many tasks fail to reach a steady state during a rolling update; when the failure threshold is crossed it stops the deployment, and with rollback enabled it restores the previous task definition automatically. That is the native rolling-update equivalent of CodeDeploy's automatic rollback. Option B alerts a human and takes no action. Option C removes the capacity floor so ECS may stop healthy tasks, which harms availability rather than protecting it. Option D scales task count in response to load and has no view of deployment health."
 },
 {
  "id": "dop-38",
  "source": "authored",
  "domain": 1,
  "topic": "Artifact retention and traceability",
  "difficulty": "medium",
  "multi": false,
  "question": "An auditor asks which commit produced the artifact currently running in production, for any release in the last two years. The pipeline stores artifacts in the default CodePipeline bucket with a 30-day lifecycle rule. What should a DevOps engineer implement?",
  "choices": {
   "A": "Publish each release artifact to a versioned S3 bucket or CodeArtifact repository under an immutable version derived from the commit ID, with a retention policy covering the audit period, and tag the deployed resources with that version.",
   "B": "Extend the lifecycle rule on the CodePipeline artifact bucket to two years and enable S3 Object Lock in governance mode.",
   "C": "Enable CloudTrail data events on the artifact bucket so every object read is recorded.",
   "D": "Enable CodePipeline execution history export to CloudWatch Logs with a two-year retention setting."
  },
  "answer": [
   "A"
  ],
  "explanation": "The pipeline artifact bucket is working storage: object keys are execution-scoped, opaque, and not intended as a release archive. Publishing a named, immutable release artifact keyed on the commit ID, retaining it for the audit period, and tagging deployed resources with the same version gives a durable link from running infrastructure back to source. Option B keeps opaque intermediate objects for longer without making them identifiable by commit. Option C records who read objects, not which commit built them. Option D preserves pipeline events but not the artifacts themselves, so the auditor cannot verify what was deployed."
 },
 {
  "id": "dop-39",
  "source": "authored",
  "domain": 1,
  "topic": "Third-party CI integration",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs its builds in an on-premises Jenkins installation but wants AWS CodePipeline to orchestrate the release, calling Jenkins as a build step and waiting for the result. Which integration should be used?",
  "choices": {
   "A": "Register a CodePipeline custom action for Jenkins and run the CodePipeline plugin on the Jenkins server, which polls for jobs and reports success or failure back to the pipeline.",
   "B": "Have the pipeline invoke a Lambda function that triggers the Jenkins job over its REST API and returns immediately.",
   "C": "Replace the source action with a Jenkins webhook that starts the pipeline after the build completes.",
   "D": "Mount the Jenkins workspace onto the CodeBuild container using Amazon EFS so the pipeline can read the build output."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodePipeline custom actions exist for exactly this: you declare an action type with a job worker, and the AWS CodePipeline plugin for Jenkins acts as that worker, polling for jobs, running the build and calling back with success or failure so the pipeline blocks until the result is known. Option B fires and forgets, so the pipeline continues regardless of the build outcome unless a callback is written by hand. Option C reverses the orchestration — Jenkins becomes the trigger rather than a step the pipeline controls. Option D shares files but provides no job control, status or ordering."
 },
 {
  "id": "dop-40",
  "source": "authored",
  "domain": 1,
  "topic": "Blue/green with API Gateway",
  "difficulty": "medium",
  "multi": false,
  "question": "An API is exposed through Amazon API Gateway backed by Lambda. The team wants to send a small share of production traffic to a new deployment of the API for validation, using API Gateway itself rather than Lambda aliases. Which feature provides this?",
  "choices": {
   "A": "A canary release on the API Gateway stage, which routes a configured percentage of requests to the canary deployment and keeps separate stage variables and metrics for it.",
   "B": "A second API Gateway stage plus a Route 53 weighted record set across the two stage invoke URLs.",
   "C": "A usage plan with a throttling limit that caps how many requests reach the new deployment.",
   "D": "A mock integration on the new stage that responds to a subset of requests."
  },
  "answer": [
   "A"
  ],
  "explanation": "API Gateway stages support canary releases natively: the stage carries both a primary deployment and a canary deployment, a percentage setting controls the traffic split, canary requests can use their own stage variables, and CloudWatch metrics are emitted separately so the canary can be evaluated before promotion. Option B works only if clients resolve two different hostnames and loses the single-stage metrics separation. Option C limits request volume but does not split traffic between versions. Option D returns fabricated responses and validates nothing about the real deployment."
 },
 {
  "id": "dop-41",
  "source": "authored",
  "domain": 1,
  "topic": "Repository approval rules",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must ensure that no change reaches the main branch of an AWS CodeCommit repository without review by at least two members of a named group, and that the rule cannot be bypassed by individual developers. What should a DevOps engineer configure?",
  "choices": {
   "A": "An approval rule template with a required approver count of two and an approval pool referencing the group, associated with the repository so it applies to every pull request targeting main.",
   "B": "An IAM policy that denies the GitPush action on the main branch for all developers.",
   "C": "A CodeBuild action in the pipeline that fails when the commit author is also the merge author.",
   "D": "A Lambda function subscribed to CodeCommit events that reverts commits pushed directly to main."
  },
  "answer": [
   "A"
  ],
  "explanation": "Approval rule templates define a required number of approvals and an approval pool, and associating a template with a repository applies it automatically to pull requests on the specified branches, so the rule is enforced by the service rather than by convention. Option B blocks direct pushes, which is a useful complement, but on its own it says nothing about how many people must review a pull request. Option C enforces a weaker, different rule and runs after the merge has already happened. Option D reacts destructively to an event that a branch policy should have prevented, and rewriting history on a shared branch breaks other clones."
 },
 {
  "id": "dop-42",
  "source": "authored",
  "domain": 1,
  "topic": "ECR lifecycle management",
  "difficulty": "easy",
  "multi": false,
  "question": "An ECR repository has grown to thousands of images because every pipeline execution pushes a uniquely tagged image. The team wants to keep the last 20 release images and remove untagged images after one day, without writing code. What should be configured?",
  "choices": {
   "A": "An ECR lifecycle policy with a rule keeping the most recent 20 images matching the release tag prefix and a second rule expiring untagged images older than one day.",
   "B": "An S3 lifecycle rule on the bucket backing the ECR repository.",
   "C": "A scheduled Lambda function that lists images and calls BatchDeleteImage according to the retention rules.",
   "D": "Enabling image tag immutability so old tags are overwritten rather than accumulating."
  },
  "answer": [
   "A"
  ],
  "explanation": "ECR lifecycle policies are evaluated by the service and support exactly these rule types: countType imageCountMoreThan scoped to a tag prefix for keeping the newest N released images, and a tagStatus untagged rule with an age threshold for sweeping intermediate layers. No code and no schedule to own. Option B is not possible because the storage behind ECR is not a customer-accessible bucket. Option C reimplements the feature and adds a function, a schedule and permissions to maintain. Option D does the opposite of what is claimed: immutability prevents tags being reused, so images accumulate rather than being overwritten."
 },
 {
  "id": "dop-43",
  "source": "authored",
  "domain": 1,
  "topic": "Ephemeral test environments",
  "difficulty": "hard",
  "multi": false,
  "question": "A team wants every pull request to get an isolated copy of the application stack for integration testing, torn down automatically when the pull request is closed. Which approach best meets this with the least standing cost?",
  "choices": {
   "A": "Deploy a CloudFormation stack named after the pull request number from a pipeline triggered on pull request events, and delete the stack from a rule that matches pull request closed events.",
   "B": "Maintain a pool of ten pre-provisioned staging environments and assign one to each pull request with a locking table.",
   "C": "Deploy every pull request into the same shared staging environment and serialise access with a manual approval action.",
   "D": "Run the integration tests against production with a feature flag that isolates the test traffic."
  },
  "answer": [
   "A"
  ],
  "explanation": "Naming the stack after the pull request gives natural isolation and idempotency: repeated pushes update the same stack, and a rule matching the pull request closed event deletes it, so nothing outlives the review and there is no idle capacity between pull requests. Option B keeps ten environments running permanently, which is the standing cost the requirement is trying to avoid, and adds a locking mechanism to maintain. Option C is not isolated at all and serialises the team behind one environment. Option D tests unreleased code against production data and infrastructure, which is a substantial risk regardless of flagging."
 },
 {
  "id": "dop-44",
  "source": "authored",
  "domain": 1,
  "topic": "Automated code review",
  "difficulty": "easy",
  "multi": false,
  "question": "A team wants automated recommendations on code quality and security issues attached as comments to pull requests, covering resource leaks, concurrency problems and AWS API misuse, without maintaining static analysis infrastructure. Which service should be used?",
  "choices": {
   "A": "Amazon CodeGuru Reviewer, associated with the repository so it comments on pull requests automatically.",
   "B": "Amazon CodeGuru Profiler, attached to the application runtime to identify expensive code paths.",
   "C": "AWS Config with managed rules evaluating the repository contents.",
   "D": "Amazon Inspector, configured to scan the source repository on each commit."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodeGuru Reviewer associates with a repository and posts recommendations directly on pull requests, targeting exactly the categories described — concurrency bugs, resource leaks, input validation and incorrect use of AWS APIs — with no infrastructure to run. Option B is the sibling service for runtime performance profiling and does not review source. Option C evaluates the configuration of AWS resources, not application source code. Option D scans workloads and container images for known vulnerabilities and does not review source in pull requests."
 },
 {
  "id": "dop-45",
  "source": "authored",
  "domain": 1,
  "topic": "Deployment scheduling",
  "difficulty": "medium",
  "multi": false,
  "question": "Company policy forbids production deployments between 09:00 and 18:00 on weekdays. Releases should queue during that window and proceed automatically afterwards, with no engineer waiting at a keyboard. Which design meets this?",
  "choices": {
   "A": "Use an EventBridge Scheduler rule to disable and re-enable the transition into the production stage at the window boundaries, so executions accumulate at the stage and resume when the transition is enabled.",
   "B": "Add a manual approval action to the production stage and instruct engineers to approve it only outside the window.",
   "C": "Configure the pipeline source action to poll only outside the restricted window.",
   "D": "Add a CodeBuild action at the start of the production stage that sleeps until the window closes."
  },
  "answer": [
   "A"
  ],
  "explanation": "Stage transitions in CodePipeline can be disabled and enabled through the API, and executions simply wait at the boundary while the transition is disabled. Driving those two calls from a schedule gives an automatic freeze window with automatic release afterwards and no human involvement. Option B satisfies the freeze only if every engineer remembers the policy, which is exactly the manual step to be removed. Option C changes when work enters the pipeline rather than when it reaches production, so a build started at 08:55 still deploys inside the window. Option D burns paid build time for hours, is capped by the build timeout, and blocks a concurrency slot."
 },
 {
  "id": "dop-46",
  "source": "authored",
  "domain": 1,
  "topic": "Multi-account deployment strategy",
  "difficulty": "hard",
  "multi": false,
  "question": "An organisation with AWS Control Tower has separate development, staging and production accounts. A central tooling account runs the pipelines. Which approach follows AWS guidance for granting the pipeline deployment access to the workload accounts?",
  "choices": {
   "A": "Create a deployment role in each workload account that trusts only the tooling account pipeline role, scoped to the resources the pipeline manages, and have the pipeline assume it per target account.",
   "B": "Create an IAM user in each workload account with programmatic access and store the access keys in the tooling account Secrets Manager.",
   "C": "Add the tooling account pipeline role as a principal directly in each workload account resource policy for every resource type deployed.",
   "D": "Enable an organization-wide SCP that allows the tooling account to act on all member account resources."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cross-account role assumption is the standard pattern: each workload account owns a role whose trust policy names the tooling account principal and whose permission policy is scoped to the resources that account's deployments touch, so access is revocable locally and auditable through CloudTrail role assumption events. Option B replaces temporary credentials with long-lived keys, which is precisely what role assumption exists to avoid. Option C requires a resource policy on every resource type, and many resources do not support them, so this does not generalise. Option D misunderstands SCPs, which can only restrict permissions within member accounts and never grant cross-account access."
 },
 {
  "id": "dop-47",
  "source": "authored",
  "domain": 1,
  "topic": "Build environment images",
  "difficulty": "medium",
  "multi": false,
  "question": "Builds intermittently fail because a base build image pulled from a public registry has changed, and the team must also reduce build start latency. What should a DevOps engineer do?",
  "choices": {
   "A": "Publish a pinned, immutable build image to Amazon ECR and configure the CodeBuild project to use that image with the ECR pull credentials of the service role.",
   "B": "Configure the CodeBuild project to retry three times when the image pull fails.",
   "C": "Increase the CodeBuild queue timeout so builds wait longer for the image to become available.",
   "D": "Switch the CodeBuild environment type to ARM so the images are smaller."
  },
  "answer": [
   "A"
  ],
  "explanation": "Depending on a mutable public tag makes builds non-reproducible and subject to upstream changes and pull rate limits. Building the image once, pushing it to ECR with an immutable tag and pointing the project at it gives a stable, versioned environment, and pulls from ECR in the same Region are faster than public registry pulls. Option B papers over the instability and retries the same moving target. Option C addresses a queueing symptom rather than the changing image. Option D changes the CPU architecture, which does not control image content and may break the toolchain entirely."
 },
 {
  "id": "dop-48",
  "source": "authored",
  "domain": 1,
  "topic": "Release versioning",
  "difficulty": "easy",
  "multi": false,
  "question": "A team needs every deployed artifact to be traceable to the exact source commit, and needs deployments to be repeatable months later. Which tagging strategy best supports this?",
  "choices": {
   "A": "Tag each artifact with an immutable identifier that includes the semantic version and the source commit ID, and never reuse a tag.",
   "B": "Tag each artifact as latest so deployments always pick up the newest build.",
   "C": "Tag artifacts with the deployment date so releases can be ordered chronologically.",
   "D": "Tag artifacts with the pipeline execution ID only, since it is unique per run."
  },
  "answer": [
   "A"
  ],
  "explanation": "An immutable tag combining the semantic version with the commit ID is both human-meaningful and precisely traceable, and because it is never reused, redeploying that tag months later produces the identical artifact. Option B is the classic anti-pattern: latest is mutable, so what deploys depends on when the deployment runs and rollbacks become ambiguous. Option C is not unique when several releases occur in a day and carries no link to source. Option D is unique and immutable but opaque, requiring a lookup in pipeline history to discover which commit it represents, and that history is eventually aged out."
 },
 {
  "id": "dop-49",
  "source": "authored",
  "domain": 1,
  "topic": "Handling long-running builds",
  "difficulty": "medium",
  "multi": false,
  "question": "A nightly build that packages a large machine learning model consistently fails after 60 minutes with a timeout. The work genuinely takes about 90 minutes. What is the correct remedy?",
  "choices": {
   "A": "Increase the build timeout on the CodeBuild project to a value above 90 minutes, up to the service maximum of 8 hours.",
   "B": "Split the buildspec into more phases so each phase finishes within the 60-minute limit.",
   "C": "Run the build with a larger compute type, since the timeout scales with the instance size.",
   "D": "Move the packaging step to a Lambda function with the maximum timeout configured."
  },
  "answer": [
   "A"
  ],
  "explanation": "The CodeBuild timeout is a project setting that defaults to 60 minutes and can be raised up to 8 hours, so a job that legitimately needs 90 minutes simply needs a higher timeout. Option B misunderstands the limit, which applies to the whole build rather than to individual phases. Option C is wrong because the timeout is an explicit configuration value and does not vary with compute type, although a larger type may reduce the runtime as a side effect. Option D is impossible for a 90-minute job, since the Lambda maximum execution time is 15 minutes."
 },
 {
  "id": "dop-50",
  "source": "authored",
  "domain": 1,
  "topic": "CodeDeploy for on-premises servers",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must deploy the same application revision to both EC2 instances and on-premises servers in its data centre using AWS CodeDeploy. What is required for the on-premises servers?",
  "choices": {
   "A": "Register each on-premises instance with CodeDeploy, install the CodeDeploy agent, and provide it with IAM credentials through an on-premises instance configuration file, then tag the registered instances so the deployment group selects them.",
   "B": "Install the CodeDeploy agent and attach an EC2 instance profile to each on-premises server.",
   "C": "Connect the data centre to the VPC with AWS Direct Connect, after which CodeDeploy discovers the servers automatically.",
   "D": "Use AWS Systems Manager hybrid activations, which register the servers with CodeDeploy deployment groups directly."
  },
  "answer": [
   "A"
  ],
  "explanation": "On-premises deployments require an explicit registration step with CodeDeploy, the agent installed on each server, and credentials supplied through the on-premises configuration file, because there is no instance metadata service to source a role from. Registered instances are then tagged with on-premises tags that the deployment group uses to select them. Option B is impossible: instance profiles are an EC2 construct delivered through instance metadata. Option C provides network connectivity but no identity or registration, so nothing is discovered. Option D confuses services — hybrid activations register managed nodes with Systems Manager, which is a separate registry from CodeDeploy on-premises instances."
 },
 {
  "id": "dop-51",
  "source": "authored",
  "domain": 1,
  "topic": "Pipeline failure handling",
  "difficulty": "medium",
  "multi": false,
  "question": "An intermittent network error occasionally fails a single action in the middle of a long pipeline. The team wants to resume from the failed stage rather than rerunning the whole pipeline from source. Which capability should they use?",
  "choices": {
   "A": "Retry the failed stage from the console or with the RetryStageExecution API, which reruns only the failed actions or the whole stage while keeping the same execution and artifacts.",
   "B": "Call StartPipelineExecution again, which resumes from the last successful stage.",
   "C": "Disable the transition into the failed stage and re-enable it, which replays the stage.",
   "D": "Enable stage-level rollback so the pipeline automatically restarts from the beginning."
  },
  "answer": [
   "A"
  ],
  "explanation": "RetryStageExecution reruns a failed stage within the existing pipeline execution, either just the failed actions or all actions in the stage, so the earlier stages and their artifacts are reused and a transient error costs only the failed stage. Option B starts a brand-new execution from the source action, which is what the team wants to avoid. Option C only controls whether executions may cross the stage boundary and does not rerun a failed action. Option D describes a rollback to a previous successful execution rather than a resume, and restarting from the beginning is again the outcome being avoided."
 },
 {
  "id": "dop-52",
  "source": "authored",
  "domain": 1,
  "topic": "Lambda layer and dependency pipelines",
  "difficulty": "medium",
  "multi": false,
  "question": "Twelve Lambda functions share the same set of heavy Python dependencies. Deployment packages are near the size limit and builds are slow. Which change improves both?",
  "choices": {
   "A": "Build the shared dependencies into a Lambda layer published by its own pipeline, and have the function packages reference the layer version.",
   "B": "Increase the Lambda deployment package limit through a service quota request.",
   "C": "Move the dependencies into an S3 bucket and download them during each cold start.",
   "D": "Enable Lambda SnapStart so the dependencies are initialised once."
  },
  "answer": [
   "A"
  ],
  "explanation": "A layer holds the shared dependencies once, is versioned and published independently, and functions reference a layer version, so each function package shrinks to its own code and the dependency build happens in a single pipeline rather than twelve. Option B is not something a quota increase covers, since the package size limits are hard service limits. Option C moves the cost into every cold start, adding latency and a runtime failure mode where there was a build-time one. Option D reduces initialisation time for supported runtimes but does not change package size or build duration, and it addresses cold start latency rather than the stated problems."
 },
 {
  "id": "dop-53",
  "source": "authored",
  "domain": 1,
  "topic": "Testing infrastructure code",
  "difficulty": "medium",
  "multi": true,
  "question": "A team wants automated validation of CloudFormation templates in the pipeline before any deployment occurs. Which TWO checks can be performed without provisioning resources?",
  "choices": {
   "A": "Run cfn-lint to validate template syntax, resource property types and Region-specific resource availability.",
   "B": "Run cfn-guard with a rules file to assert policy compliance, such as requiring encryption on all storage resources.",
   "C": "Run drift detection on the stack to compare deployed resources against the template.",
   "D": "Create a change set and read the resource replacement column to confirm no data stores are replaced.",
   "E": "Run the AWS CLI wait stack-create-complete command to confirm the template deploys cleanly."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "cfn-lint parses the template and validates structure, property types, intrinsic function usage and whether the resources exist in the target Region, all statically. cfn-guard evaluates the template against a policy-as-code rules file, so requirements like mandatory encryption are enforced before deployment. Neither provisions anything. Option C requires a stack that already exists, so it cannot run before the first deployment and it inspects live resources. Option D is a valuable safety check but a change set is created against a real stack by the CloudFormation service, so it is not purely static. Option E deploys the stack, which is exactly what the question excludes."
 },
 {
  "id": "dop-54",
  "source": "authored",
  "domain": 1,
  "topic": "Source artifact handling",
  "difficulty": "medium",
  "multi": false,
  "question": "A build needs the full git history to compute a version number from tags, but the CodePipeline source action delivers only a snapshot of the files without the .git directory. What is the appropriate fix?",
  "choices": {
   "A": "Configure the source action output artifact format as full clone and grant the downstream CodeBuild project role permission to use the connection, so the build receives repository metadata and can fetch history.",
   "B": "Add a git clone command to the buildspec install phase using credentials stored in the build environment.",
   "C": "Enable versioning on the artifact bucket so previous artifact versions serve as history.",
   "D": "Switch the source action to poll mode, which includes the git metadata in the artifact."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodePipeline source actions for git providers offer an output artifact format of CODEBUILD_CLONE_REF, commonly called full clone, which passes repository reference metadata instead of a zipped snapshot so a downstream CodeBuild action can perform a real clone with history. The build project's role must be granted permission to use the connection. Option B is the manual version of this and requires managing credentials that the connection already provides. Option C confuses artifact object versions with git history; they are unrelated. Option D is false, since the polling versus webhook choice affects triggering only, not artifact content."
 },
 {
  "id": "dop-55",
  "source": "authored",
  "domain": 1,
  "topic": "Progressive delivery decision",
  "difficulty": "hard",
  "multi": false,
  "question": "A payment service must be released with the ability to detect a regression using real production traffic, but any faulty behaviour must affect the smallest possible number of customers, and the previous version must remain instantly available. Cost of running duplicate capacity for a short period is acceptable. Which strategy fits best?",
  "choices": {
   "A": "A canary deployment onto a blue/green topology, shifting a small percentage of traffic first while the previous fleet stays live, with automated rollback on error-rate alarms.",
   "B": "An all-at-once in-place deployment with a rollback plan that redeploys the previous artifact if problems are reported.",
   "C": "A rolling deployment in batches of 25% with health checks between batches.",
   "D": "A blue/green cutover that shifts 100% of traffic at once after the green fleet passes synthetic tests."
  },
  "answer": [
   "A"
  ],
  "explanation": "The requirements combine two ideas: real production traffic in a small share, which is a canary, and an instantly available previous version, which is what a blue/green topology preserves because the old fleet keeps running. Adding alarm-driven automatic rollback closes the loop without waiting for a human. Option B exposes every customer at once and rollback means a fresh deployment rather than a traffic shift. Option C limits blast radius somewhat but each batch is updated in place, so the previous version disappears progressively and cannot be returned to instantly. Option D preserves the old fleet but sends all customers to the new version simultaneously, so a regression affects everyone before it is detected."
 },
 {
  "id": "dop-56",
  "source": "authored",
  "domain": 2,
  "topic": "CloudFormation StackSets",
  "difficulty": "hard",
  "multi": false,
  "question": "A security team must ensure a standard set of AWS Config rules exists in every account in an organisational unit, including accounts created in the future, with no per-account action. The organisation uses AWS Organizations with all features enabled. What should a DevOps engineer implement?",
  "choices": {
   "A": "A CloudFormation StackSet with service-managed permissions targeting the organisational unit, with automatic deployment enabled so new accounts receive the stack instances on creation.",
   "B": "A CloudFormation StackSet with self-managed permissions targeting an explicit list of account IDs, refreshed by a monthly job that adds new accounts.",
   "C": "A CloudFormation template distributed through AWS Service Catalog with a portfolio shared to the organisational unit.",
   "D": "An SCP applied to the organisational unit that requires the Config rules to exist before other API calls succeed."
  },
  "answer": [
   "A"
  ],
  "explanation": "Service-managed StackSets integrate with AWS Organizations so targets are expressed as organisational units rather than account IDs, and enabling automatic deployment causes CloudFormation to create stack instances in accounts added to the OU later and remove them when accounts leave. That satisfies the future-accounts requirement with no ongoing work. Option B works today but requires the monthly reconciliation job the requirement rules out. Option C makes a product available for someone to launch and does not deploy anything on its own. Option D misunderstands SCPs, which can only deny or allow API actions and cannot create resources."
 },
 {
  "id": "dop-57",
  "source": "authored",
  "domain": 2,
  "topic": "CloudFormation signalling",
  "difficulty": "hard",
  "multi": false,
  "question": "A CloudFormation stack creates an Auto Scaling group whose instances run a lengthy bootstrap script. The stack reports CREATE_COMPLETE while the application is still installing, so a dependent resource fails. How should the template be changed so the stack waits until the instances are genuinely ready?",
  "choices": {
   "A": "Add a CreationPolicy with a ResourceSignal count and timeout to the Auto Scaling group, and call cfn-signal at the end of the bootstrap script.",
   "B": "Add a DependsOn attribute from the dependent resource to the Auto Scaling group.",
   "C": "Add an UpdatePolicy with a rolling update configuration to the Auto Scaling group.",
   "D": "Increase the stack timeout in the CloudFormation stack settings."
  },
  "answer": [
   "A"
  ],
  "explanation": "A CreationPolicy with ResourceSignal makes CloudFormation hold the resource in CREATE_IN_PROGRESS until the required number of success signals arrive from cfn-signal, or the timeout expires, so the stack only proceeds once the bootstrap has actually finished. Option B is the trap: DependsOn orders resource creation but is satisfied as soon as the Auto Scaling group resource exists, which is precisely the premature completion described. Option C governs how instances are replaced during updates and has no effect on create. Option D changes how long CloudFormation waits before giving up, not what it waits for."
 },
 {
  "id": "dop-58",
  "source": "authored",
  "domain": 2,
  "topic": "Protecting stateful resources",
  "difficulty": "medium",
  "multi": true,
  "question": "A CloudFormation stack manages a production Amazon RDS database. The team must ensure the database survives both a stack deletion and a template change that would otherwise replace it. Which TWO attributes should be set on the database resource?",
  "choices": {
   "A": "DeletionPolicy set to Snapshot or Retain.",
   "B": "UpdateReplacePolicy set to Snapshot or Retain.",
   "C": "DependsOn referencing the VPC resource.",
   "D": "Metadata containing a cfn-init configuration set.",
   "E": "CreationPolicy with a ResourceSignal timeout."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "The two attributes cover two different events. DeletionPolicy controls what happens when the resource is removed from the stack or the stack is deleted, and Retain or Snapshot keeps the data. UpdateReplacePolicy covers the separate case where an update changes an immutable property and CloudFormation replaces the resource, deleting the old one — without it, a Retain-only template still loses the original database on a replacing update. Option C only orders creation. Option D carries bootstrap configuration for EC2 helper scripts. Option E makes creation wait for signals and has nothing to do with deletion or replacement."
 },
 {
  "id": "dop-59",
  "source": "authored",
  "domain": 2,
  "topic": "Cross-stack references",
  "difficulty": "hard",
  "multi": false,
  "question": "A networking stack exports a VPC ID that ten application stacks consume with Fn::ImportValue. The networking team now needs to change a property that would replace the VPC, but the update fails. What is the cause and the appropriate remedy?",
  "choices": {
   "A": "An exported output cannot be changed or removed while another stack imports it, so the application stacks must first stop importing the value — for example by switching to a Systems Manager Parameter Store lookup — before the export can change.",
   "B": "The export is locked by a stack policy, which must be temporarily replaced with one that allows updates to outputs.",
   "C": "Exports can only be consumed by five stacks, so the eleventh import broke the dependency graph.",
   "D": "Drift detection has flagged the VPC, and the stack must be resynchronised before any update proceeds."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudFormation deliberately prevents an exported output from being modified or deleted while any stack imports it, which creates exactly this rigid coupling between a shared infrastructure stack and its consumers. Breaking the dependency first — commonly by publishing the value to Parameter Store and having consumers read it as a dynamic reference or parameter, which creates no hard link — restores the ability to change the producing stack. Option B misattributes the error; stack policies protect resources during updates and do not govern exports. Option C invents a limit that does not exist. Option D describes an unrelated feature and drift never blocks updates in this way."
 },
 {
  "id": "dop-60",
  "source": "authored",
  "domain": 2,
  "topic": "CloudFormation custom resources",
  "difficulty": "hard",
  "multi": false,
  "question": "A CloudFormation stack must configure a setting in a third-party SaaS product during creation and remove it on deletion. The stack currently hangs for an hour and then fails when the custom resource is created. What is the most likely cause?",
  "choices": {
   "A": "The backing Lambda function is not sending a response to the pre-signed S3 URL provided in the event, so CloudFormation waits for the response until it times out.",
   "B": "The custom resource type name does not begin with Custom:: so CloudFormation cannot route the request.",
   "C": "The Lambda function lacks permission to call CloudFormation SignalResource.",
   "D": "The stack is missing a CreationPolicy on the custom resource."
  },
  "answer": [
   "A"
  ],
  "explanation": "Custom resources are asynchronous: CloudFormation invokes the handler with a ResponseURL and then blocks until a SUCCESS or FAILED response is PUT to that pre-signed URL. If the function errors before responding, times out, or simply omits the callback, CloudFormation has no way to know and waits for the full timeout before failing — the classic hanging custom resource. Robust handlers therefore respond in an exception handler as well as on the happy path. Option B is wrong because both Custom:: names and service tokens are routed correctly, and a bad type would fail fast rather than hang. Option C names an API that custom resources do not use. Option D is not applicable, since custom resources signal through the response URL rather than a CreationPolicy."
 },
 {
  "id": "dop-61",
  "source": "authored",
  "domain": 2,
  "topic": "Systems Manager State Manager",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must guarantee that a monitoring agent is installed and running on every managed EC2 instance, and that any instance where the agent is stopped is corrected automatically within a few hours. Which service capability provides this?",
  "choices": {
   "A": "An AWS Systems Manager State Manager association that applies a document installing and starting the agent, targeted by tag with a schedule so it reapplies periodically.",
   "B": "An AWS Systems Manager Run Command invocation executed by an engineer after each fleet change.",
   "C": "An AWS Config rule that checks for the agent and reports non-compliant instances.",
   "D": "A user data script in the launch template that installs the agent at boot."
  },
  "answer": [
   "A"
  ],
  "explanation": "State Manager exists to hold managed nodes at a desired configuration: an association binds a document to a target set, runs on a schedule, and reapplies the configuration, so an agent that has been stopped is restarted on the next run without human involvement. Option B is a one-off push that has to be repeated by a person. Option C detects the drift and reports it but takes no corrective action on its own. Option D covers only the moment of launch, so an agent that stops later, or an instance built from an older image, stays broken."
 },
 {
  "id": "dop-62",
  "source": "authored",
  "domain": 2,
  "topic": "Patch Manager",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must patch development instances one week after patches are released and production instances three weeks after, using different approval delays, and must report compliance per environment. How should this be configured in AWS Systems Manager Patch Manager?",
  "choices": {
   "A": "Create two patch baselines with different auto-approval delays, create patch groups for development and production using the Patch Group tag on instances, and register each baseline with its patch group.",
   "B": "Create one patch baseline with a three-week auto-approval delay and run it against development instances one week early with Run Command.",
   "C": "Create two maintenance windows with different schedules, both using the default patch baseline.",
   "D": "Create two AWS Config rules that evaluate patch age and remediate non-compliant instances."
  },
  "answer": [
   "A"
  ],
  "explanation": "Patch Manager separates what to patch from where: a patch baseline carries the approval rules including the auto-approval delay, and a patch group is a set of instances identified by the Patch Group tag. Registering a baseline with a patch group binds them, so two baselines with different delays give the two environments different approval behaviour, and compliance is reported per group. Option B ignores the baseline's own approval rules, so patches not yet approved would not be applied. Option C changes only when patching runs, leaving both environments on identical approval rules. Option D reports and remediates generically but does not implement approval delays, which is the core requirement."
 },
 {
  "id": "dop-63",
  "source": "authored",
  "domain": 2,
  "topic": "Drift detection and remediation",
  "difficulty": "medium",
  "multi": false,
  "question": "Engineers occasionally change security group rules by hand, causing infrastructure to diverge from the CloudFormation templates. The team wants to be alerted within a day of any such divergence across many stacks. Which approach is most appropriate?",
  "choices": {
   "A": "Schedule CloudFormation drift detection across the stacks with an EventBridge rule and a Systems Manager Automation runbook, and raise a notification when a stack reports DRIFTED.",
   "B": "Enable termination protection on all stacks so resources cannot be modified.",
   "C": "Apply a stack policy denying updates to security group resources.",
   "D": "Turn on AWS Config with the cloudformation-stack-drift-detection-check rule and rely on it to revert changes automatically."
  },
  "answer": [
   "A"
  ],
  "explanation": "Drift detection compares live resource properties with the template and marks each stack and resource as in sync or drifted, but it is an on-demand operation, so scheduling it — commonly with an EventBridge schedule invoking an Automation runbook that calls DetectStackDrift and inspects the result — gives the daily coverage and alerting required. Option B prevents stacks being deleted, not resources being edited. Option C restricts what a CloudFormation update may change and has no effect on someone editing a security group directly in the console. Option D names a real Config rule, but that rule evaluates and reports drift status; it does not revert changes automatically, so the claim in the option is wrong."
 },
 {
  "id": "dop-64",
  "source": "authored",
  "domain": 2,
  "topic": "Dynamic references to secrets",
  "difficulty": "medium",
  "multi": false,
  "question": "A CloudFormation template creates an Amazon RDS instance and must set the master password from a value held in AWS Secrets Manager, without the password appearing in the template, in stack parameters, or in the stack events. What should the template use?",
  "choices": {
   "A": "A dynamic reference of the form resolve secretsmanager with the secret name and JSON key, which CloudFormation resolves at deploy time without storing the value.",
   "B": "A NoEcho template parameter whose value is passed in by the pipeline at deploy time.",
   "C": "A Systems Manager Parameter Store SecureString parameter referenced with an SSM parameter type.",
   "D": "A custom resource that reads the secret and returns it as an output for the database resource to reference."
  },
  "answer": [
   "A"
  ],
  "explanation": "The secretsmanager dynamic reference is resolved by CloudFormation when the stack is deployed and the value is never persisted in the template, the change set or the stack events, which is exactly the requirement. Option B hides the value in the console but the parameter is still supplied to the stack and NoEcho does not protect it everywhere, notably in the pipeline definition that passes it. Option C is closer but CloudFormation does not support SecureString for the SSM parameter types in most resource contexts, and the value would still need decryption handling. Option D exposes the secret in the custom resource response and therefore in stack data, which is the opposite of the requirement."
 },
 {
  "id": "dop-65",
  "source": "authored",
  "domain": 2,
  "topic": "Nested stacks versus cross-stack references",
  "difficulty": "medium",
  "multi": false,
  "question": "A large template has exceeded CloudFormation resource limits and become hard to review. The team wants to break it apart, keeping a single deployment unit that is created, updated and deleted together. Which approach fits?",
  "choices": {
   "A": "Refactor the shared components into nested stacks referenced by AWS::CloudFormation::Stack resources in a parent template.",
   "B": "Split the template into independent stacks that exchange values through exports and Fn::ImportValue.",
   "C": "Convert the template to a StackSet targeting the same account and Region.",
   "D": "Split the resources across several templates deployed by separate pipeline actions in the same stage."
  },
  "answer": [
   "A"
  ],
  "explanation": "Nested stacks are the mechanism for decomposing one large template while keeping a single lifecycle: the parent owns the children, so creating, updating or deleting the parent cascades, and resource limits apply per stack rather than to the whole tree. Option B produces independently deployable stacks, which loses the single deployment unit and introduces the export coupling that makes later changes difficult. Option C misuses StackSets, which exist to replicate a stack across accounts and Regions rather than to decompose one. Option D splits the deployment into unrelated stacks whose lifecycles are only coincidentally aligned by pipeline ordering."
 },
 {
  "id": "dop-66",
  "source": "authored",
  "domain": 2,
  "topic": "Importing existing resources",
  "difficulty": "medium",
  "multi": false,
  "question": "A production S3 bucket was created manually and must now be managed by an existing CloudFormation stack, without any interruption or recreation of the bucket. What should a DevOps engineer do?",
  "choices": {
   "A": "Add the bucket to the template with a DeletionPolicy of Retain and use a resource import change set that supplies the bucket identifier, so CloudFormation takes over management without modifying the resource.",
   "B": "Add the bucket to the template and run a normal stack update, which adopts existing resources with matching names.",
   "C": "Delete the bucket and recreate it through the stack, restoring the objects from a backup afterwards.",
   "D": "Create a custom resource that wraps the bucket so the stack can manage it indirectly."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudFormation supports importing existing resources through a change set of type IMPORT: you add the resource to the template with a DeletionPolicy of Retain, supply its physical identifier, and CloudFormation begins managing it without creating, modifying or deleting anything. Option B fails, because a normal update attempts to create the resource and errors when the bucket name is already taken. Option C causes exactly the interruption and data movement the requirement forbids. Option D leaves the bucket outside CloudFormation management, hidden behind a Lambda function that now must implement every lifecycle operation."
 },
 {
  "id": "dop-67",
  "source": "authored",
  "domain": 2,
  "topic": "Service Catalog governance",
  "difficulty": "medium",
  "multi": false,
  "question": "A platform team wants developers to provision approved database configurations themselves, without giving them permission to create RDS resources directly, and wants every provisioned instance to inherit standard tags. Which service provides this?",
  "choices": {
   "A": "AWS Service Catalog, publishing the CloudFormation template as a product in a portfolio with a launch constraint role and a TagOptions library.",
   "B": "AWS Systems Manager Automation runbooks shared with the developer accounts.",
   "C": "AWS Config conformance packs applied to the developer accounts.",
   "D": "IAM permission boundaries attached to the developer roles allowing only approved RDS instance classes."
  },
  "answer": [
   "A"
  ],
  "explanation": "Service Catalog is designed for this delegation: products encapsulate approved templates, a launch constraint lets the product be provisioned using a role with the necessary permissions so end users never hold them directly, and TagOptions enforce a standard tag library on provisioned products. Option B can automate provisioning but has no product catalogue, no self-service portfolio model and no tag enforcement. Option C evaluates compliance after resources exist rather than controlling provisioning. Option D constrains what developers may create but still grants them RDS permissions directly and enforces no tagging or template standardisation."
 },
 {
  "id": "dop-68",
  "source": "authored",
  "domain": 2,
  "topic": "Elastic Beanstalk configuration",
  "difficulty": "medium",
  "multi": false,
  "question": "An Elastic Beanstalk environment needs an additional package installed and a configuration file written on every instance, and the settings must be applied consistently whenever a new environment is created from the same application version. What is the recommended mechanism?",
  "choices": {
   "A": "Include .ebextensions configuration files in the application source bundle, declaring the packages and files to be applied at deployment.",
   "B": "Connect to each instance with Session Manager after deployment and apply the changes manually.",
   "C": "Bake the package and file into a custom AMI and set the environment to use it, updating the AMI on every change.",
   "D": "Add the commands to the environment variables of the environment configuration."
  },
  "answer": [
   "A"
  ],
  "explanation": "Files under .ebextensions travel with the application source bundle and are processed on every deployment and on every new environment created from that version, using declarative keys such as packages, files, commands and container_commands. That gives reproducibility tied to the application version. Option B is manual and lost on the next instance replacement. Option C is a valid pattern for heavier customisation, but rebuilding an AMI for a package and a config file is far more work and decouples the change from the application version. Option D misunderstands environment variables, which set values in the process environment and cannot install packages or write files."
 },
 {
  "id": "dop-69",
  "source": "authored",
  "domain": 2,
  "topic": "Immutable versus mutable infrastructure",
  "difficulty": "medium",
  "multi": false,
  "question": "A team currently updates running EC2 instances in place with a configuration management agent. They want to eliminate configuration drift entirely and make every environment reproducible from source. Which change achieves that goal?",
  "choices": {
   "A": "Adopt immutable infrastructure: bake configuration into a versioned machine image and replace instances on every change rather than modifying running instances.",
   "B": "Increase the frequency of the configuration management runs from hourly to every five minutes.",
   "C": "Enable detailed monitoring so drift is detected faster.",
   "D": "Move the configuration management agent into a container running on each instance."
  },
  "answer": [
   "A"
  ],
  "explanation": "Drift arises because running instances are mutable and accumulate changes between convergence runs, from manual edits, partial failures and version skew. Immutable infrastructure removes the mutation step: the image is versioned and built from source, and any change produces a new image and new instances, so what runs always matches what was built. Option B narrows the window in which drift exists but does not eliminate it, and increases load and the chance of partial convergence. Option C improves visibility of metrics and has no bearing on configuration state. Option D relocates the same mutable process without changing its nature."
 },
 {
  "id": "dop-70",
  "source": "authored",
  "domain": 2,
  "topic": "CloudFormation stack failure handling",
  "difficulty": "medium",
  "multi": false,
  "question": "A CloudFormation stack update fails partway through and rolls back, but the team needs to inspect the resources in their failed state to diagnose the problem. Which option supports this?",
  "choices": {
   "A": "Set the stack failure option to preserve successfully provisioned resources so the stack stops in UPDATE_FAILED without rolling back, then investigate and either retry or roll back manually.",
   "B": "Enable termination protection so the stack cannot roll back.",
   "C": "Apply a stack policy denying the Update action on all resources.",
   "D": "Set the DeletionPolicy of every resource to Retain so nothing is removed during the rollback."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudFormation offers a stack failure behaviour that preserves successfully provisioned resources rather than rolling back, leaving the stack in a failed state that can be inspected and then continued or rolled back deliberately. This is the supported way to debug a failing deployment. Option B protects against stack deletion only. Option C blocks updates from starting rather than controlling what happens when one fails. Option D affects resource deletion but does not stop CloudFormation reverting property changes on resources that already existed, so the failed state is still lost."
 },
 {
  "id": "dop-71",
  "source": "authored",
  "domain": 2,
  "topic": "AMI selection in templates",
  "difficulty": "medium",
  "multi": false,
  "question": "A CloudFormation template hardcodes an AMI ID per Region in a Mappings section, and the mapping must be edited whenever Amazon releases a new Amazon Linux image. What is the cleanest way to always launch the latest approved Amazon Linux AMI?",
  "choices": {
   "A": "Declare a parameter of type AWS::SSM::Parameter::Value<AWS::EC2::Image::Id> whose default is the public Systems Manager parameter path for the latest Amazon Linux AMI.",
   "B": "Use a custom resource backed by a Lambda function that calls DescribeImages and returns the newest AMI ID.",
   "C": "Add a Fn::FindInMap call that selects the AMI by the AWS::Region pseudo parameter and refresh the mapping monthly with a scheduled job.",
   "D": "Reference the AMI by name instead of ID using Fn::ImportValue."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS publishes the latest AMI IDs as public Systems Manager parameters, and CloudFormation supports parameter types that resolve an SSM parameter to a typed value at deploy time. Declaring the parameter with the public path as its default means every deployment picks up the current image with no template edits and no code. Option B achieves the same result but adds a Lambda function, permissions and a custom resource to own. Option C keeps the maintenance burden and merely automates the editing. Option D is not valid, since Fn::ImportValue reads another stack's exports and AMIs must be referenced by ID."
 },
 {
  "id": "dop-72",
  "source": "authored",
  "domain": 2,
  "topic": "Systems Manager Automation",
  "difficulty": "medium",
  "multi": false,
  "question": "An operations team performs a twelve-step recovery procedure by hand, involving EC2 API calls, a Lambda invocation and an approval from a manager partway through. They want to codify it so it runs consistently and is auditable. Which service should they use?",
  "choices": {
   "A": "An AWS Systems Manager Automation runbook, which supports aws:executeAwsApi, aws:invokeLambdaFunction and aws:approve steps with branching and error handling.",
   "B": "An AWS Systems Manager Run Command document, which executes the shell commands on the target instances in order.",
   "C": "An AWS Config remediation action referencing a Lambda function.",
   "D": "An Amazon EventBridge rule with twelve targets invoked in sequence."
  },
  "answer": [
   "A"
  ],
  "explanation": "Automation runbooks orchestrate multi-step operational procedures across AWS APIs, with built-in action types for calling any AWS API, invoking Lambda, branching on results, and pausing for a human decision with aws:approve. Execution history gives the audit trail. Option B runs commands on managed nodes and has no orchestration or approval semantics across AWS APIs. Option C is a narrow hook for correcting a non-compliant resource, not a general procedure with an approval gate. Option D fans out to targets in parallel with no ordering, no branching and no approval step."
 },
 {
  "id": "dop-73",
  "source": "authored",
  "domain": 2,
  "topic": "Parameter Store hierarchies",
  "difficulty": "easy",
  "multi": false,
  "question": "An application reads about forty configuration values that differ per environment. The team wants a single API call per environment to retrieve them all and wants environment-scoped IAM permissions. How should the parameters be organised in AWS Systems Manager Parameter Store?",
  "choices": {
   "A": "Store parameters under a path hierarchy such as slash app slash prod slash and read them with GetParametersByPath, granting IAM access by path prefix.",
   "B": "Store all values as a single JSON document in one parameter and parse it in the application.",
   "C": "Store each value as a separate parameter with the environment encoded in the name and call GetParameter for each one.",
   "D": "Store the values as tags on the parameters and filter by tag at read time."
  },
  "answer": [
   "A"
  ],
  "explanation": "Parameter Store paths are hierarchical, GetParametersByPath returns every parameter beneath a path in one call with pagination, and IAM resource ARNs support path prefixes so a role can be granted access to one environment's subtree only. That satisfies both requirements directly. Option B is a single call but loses per-parameter versioning, history and granular permissions, and any change rewrites the whole document. Option C makes forty API calls and cannot express environment-scoped permissions cleanly. Option D misuses tags, which are metadata for organisation and cost allocation rather than a retrieval mechanism for values."
 },
 {
  "id": "dop-74",
  "source": "authored",
  "domain": 2,
  "topic": "StackSet operation preferences",
  "difficulty": "hard",
  "multi": false,
  "question": "A StackSet update to 300 accounts caused a widespread outage because a template error was rolled out everywhere before anyone noticed. Which StackSet configuration would have limited the damage?",
  "choices": {
   "A": "Operation preferences with a low failure tolerance and a small maximum concurrent count, so the operation halts after a few account failures rather than continuing.",
   "B": "Automatic deployment enabled, so accounts receive the update only when they join the organisational unit.",
   "C": "Service-managed permissions instead of self-managed permissions.",
   "D": "A stack policy on each stack instance denying updates to critical resources."
  },
  "answer": [
   "A"
  ],
  "explanation": "StackSet operation preferences control the rollout: failure tolerance sets how many account and Region failures are permitted before the operation stops, and the maximum concurrent count limits how many targets are updated at once. Setting both low turns a mass rollout into a progressive one that halts on the first signs of trouble. Option B controls which accounts get stack instances rather than how an update is paced. Option C is a permissions model and does not affect rollout behaviour. Option D would block the update to protected resources rather than stopping a bad rollout, and maintaining stack policies across 300 accounts is impractical."
 },
 {
  "id": "dop-75",
  "source": "authored",
  "domain": 2,
  "topic": "CDK bootstrapping",
  "difficulty": "medium",
  "multi": false,
  "question": "A team is deploying a CDK application into a new account and Region for the first time and receives an error stating that the environment has not been bootstrapped. What does bootstrapping provision?",
  "choices": {
   "A": "A CloudFormation stack containing the staging bucket, ECR repository and IAM roles that the CDK uses to upload assets and execute deployments in that account and Region.",
   "B": "A VPC and subnets that CDK constructs use as their default network.",
   "C": "A CodePipeline that deploys the CDK application on every commit.",
   "D": "A Service Catalog portfolio containing the synthesised CloudFormation templates."
  },
  "answer": [
   "A"
  ],
  "explanation": "cdk bootstrap deploys a CDKToolkit stack into each target account and Region, creating the asset staging bucket, an ECR repository for container image assets, and the deployment, file publishing and image publishing roles that the CDK assumes. Without it the CDK has nowhere to upload assets and no role to deploy with, which is the error described. Option B is wrong: CDK constructs create or look up networking themselves and bootstrapping provisions no VPC. Option C describes CDK Pipelines, a separate opt-in construct. Option D is unrelated to the bootstrap process."
 },
 {
  "id": "dop-76",
  "source": "authored",
  "domain": 2,
  "topic": "Run Command at scale",
  "difficulty": "medium",
  "multi": false,
  "question": "A DevOps engineer must run a diagnostic script on 5,000 EC2 instances, limiting the blast radius so that the command stops if it fails on more than a few instances, and capping how many instances run it at once. Which Run Command settings achieve this?",
  "choices": {
   "A": "Set a concurrency value such as 10% for the rate control and an error threshold such as 5 errors, so Systems Manager throttles execution and stops after the threshold is reached.",
   "B": "Split the fleet into ten Run Command invocations by tag and run them one at a time.",
   "C": "Use a maintenance window with a one-hour duration so the command cannot affect the entire fleet.",
   "D": "Set the document timeout to a low value so failing instances abort quickly."
  },
  "answer": [
   "A"
  ],
  "explanation": "Run Command supports rate control natively: concurrency, expressed as an absolute number or a percentage of targets, limits how many instances execute at once, and the error threshold stops the whole invocation once that many executions fail. Together they give exactly the throttling and blast-radius control described. Option B achieves partial batching but requires manual sequencing and gives no automatic stop on failures. Option C bounds the time available rather than the concurrency or failure count. Option D shortens individual executions but does nothing to limit how many run simultaneously or to halt the invocation."
 },
 {
  "id": "dop-77",
  "source": "authored",
  "domain": 2,
  "topic": "Configuration for containers",
  "difficulty": "medium",
  "multi": false,
  "question": "An ECS task definition must supply a database password to the container. Security requires the value not be visible in the task definition or in the ECS console. What should be configured?",
  "choices": {
   "A": "Define the value under the secrets key of the container definition, referencing the Secrets Manager secret ARN, and grant the task execution role permission to read it.",
   "B": "Define the value under the environment key of the container definition with the password as the value.",
   "C": "Store the password in the container image and read it from a file at startup.",
   "D": "Pass the password as a command line argument in the container command override."
  },
  "answer": [
   "A"
  ],
  "explanation": "The secrets key in an ECS container definition takes an ARN of a Secrets Manager secret or an SSM parameter, and the ECS agent injects the resolved value as an environment variable at task start using the task execution role. The task definition contains only the ARN, so the value never appears in the definition or the console. Option B stores the password in plain text in the task definition, which is readable by anyone with describe permissions. Option C bakes a secret into an image that is stored in a registry and distributed widely. Option D exposes the value in the task definition and typically in process listings inside the container."
 },
 {
  "id": "dop-78",
  "source": "authored",
  "domain": 2,
  "topic": "CloudFormation rollback triggers",
  "difficulty": "hard",
  "multi": false,
  "question": "A team wants a CloudFormation stack update to roll back automatically if application error rates rise during the update and for a monitoring period afterwards, even though every resource reports created successfully. What should be configured?",
  "choices": {
   "A": "Rollback configuration on the stack update, specifying CloudWatch alarms as rollback triggers and a monitoring time in minutes after the update completes.",
   "B": "A CreationPolicy with a ResourceSignal timeout matching the monitoring period.",
   "C": "A stack policy that denies updates while the alarm is in ALARM state.",
   "D": "An UpdatePolicy with a rolling update pause time on the Auto Scaling group."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudFormation rollback configuration lets you nominate CloudWatch alarms as rollback triggers and set a monitoring time of up to 180 minutes; if any trigger enters ALARM during the update or during that trailing window, CloudFormation rolls the stack back automatically. This addresses exactly the case where resources deploy cleanly but the application misbehaves. Option B waits for signals during creation and provides no post-update monitoring or alarm evaluation. Option C prevents an update from changing protected resources rather than reacting to alarms. Option D paces instance replacement within an Auto Scaling group and has no view of the stack outcome or application metrics."
 },
 {
  "id": "dop-79",
  "source": "authored",
  "domain": 2,
  "topic": "Managing hybrid nodes",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must apply the same patching, inventory collection and remote access controls to 200 servers in its own data centre as it does to its EC2 fleet. Which approach enables this?",
  "choices": {
   "A": "Create a Systems Manager hybrid activation, install the SSM Agent on each server and register it with the activation code and ID so it becomes a managed node.",
   "B": "Install the CloudWatch agent on each server and configure it with an IAM user access key.",
   "C": "Connect the data centre with AWS Direct Connect so the servers appear in the EC2 console.",
   "D": "Create an EC2 instance profile and copy its credentials onto each on-premises server."
  },
  "answer": [
   "A"
  ],
  "explanation": "Hybrid activations are the supported way to bring non-EC2 servers under Systems Manager: the activation produces an ID and code used once at registration, after which the node appears as a managed instance and can be targeted by Patch Manager, Inventory, Run Command and Session Manager exactly like an EC2 instance. Option B installs telemetry only and does not make the server a managed node. Option C provides network connectivity but no management registration, and on-premises servers never appear in the EC2 console. Option D is not possible, because instance profile credentials are delivered through the EC2 metadata service and cannot be copied to arbitrary hosts."
 },
 {
  "id": "dop-80",
  "source": "authored",
  "domain": 2,
  "topic": "Reusable infrastructure components",
  "difficulty": "medium",
  "multi": false,
  "question": "A platform team publishes a standard VPC pattern that twenty application teams must reuse in their own CloudFormation templates, and wants updates to the pattern to be adopted by version rather than copied by hand. Which CloudFormation feature is designed for this?",
  "choices": {
   "A": "CloudFormation modules, published to the CloudFormation registry with a version, and referenced as a resource type inside consuming templates.",
   "B": "CloudFormation macros, which transform the template at deploy time.",
   "C": "Fn::Transform with the AWS::Include transform pulling a snippet from an S3 bucket.",
   "D": "Stack exports consumed with Fn::ImportValue by each application template."
  },
  "answer": [
   "A"
  ],
  "explanation": "Modules package a reusable set of resources with a schema, are published to the CloudFormation registry with an explicit version, and are then used inside templates like any other resource type, so consumers upgrade by changing the version they reference. That is precisely the versioned reuse described. Option B rewrites templates through a Lambda function, which is powerful but unversioned and much harder to reason about. Option C injects a raw snippet from a bucket with no schema, no validation and no version semantics unless built by hand. Option D shares runtime values from a deployed stack rather than sharing a reusable definition."
 },
 {
  "id": "dop-81",
  "source": "authored",
  "domain": 2,
  "topic": "Compliance as code",
  "difficulty": "medium",
  "multi": true,
  "question": "An organisation wants continuous evaluation of resource configuration against internal standards across all accounts, with automatic correction of certain violations. Which TWO AWS Config capabilities support this?",
  "choices": {
   "A": "Conformance packs, which deploy a collection of Config rules and remediation actions as a single unit across accounts and Regions.",
   "B": "Remediation actions attached to Config rules, which invoke Systems Manager Automation runbooks against non-compliant resources.",
   "C": "Config aggregators, which enforce rules centrally by blocking non-compliant API calls.",
   "D": "Config advanced queries, which automatically revert resources to their last compliant configuration.",
   "E": "Config configuration recorders, which prevent resources being created in an unapproved state."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Conformance packs bundle rules and remediation into a deployable unit that can be applied organisation-wide, giving consistent standards everywhere. Remediation actions attach to a rule and run a Systems Manager Automation runbook against the non-compliant resource, either automatically or on demand, which is the corrective half of the requirement. Option C misstates aggregators, which collect compliance data from many accounts for viewing and never block API calls. Option D misstates advanced queries, which run SQL-like searches over configuration data and change nothing. Option E misstates the configuration recorder, which observes and records configuration changes and is purely detective."
 },
 {
  "id": "dop-82",
  "source": "authored",
  "domain": 2,
  "topic": "Template testing and validation",
  "difficulty": "medium",
  "multi": false,
  "question": "A pipeline deploys a CloudFormation stack to a test account and must verify that the resulting infrastructure actually behaves correctly, not merely that the stack reached CREATE_COMPLETE. Which addition best meets this?",
  "choices": {
   "A": "A test action after the deploy that reads the stack outputs and runs functional assertions against the live endpoints, failing the pipeline when an assertion fails.",
   "B": "A cfn-lint run against the template before deployment.",
   "C": "A drift detection call immediately after the stack completes.",
   "D": "A change set review before the deployment proceeds."
  },
  "answer": [
   "A"
  ],
  "explanation": "CREATE_COMPLETE only means CloudFormation provisioned the declared resources; it says nothing about whether the endpoint responds, the security group permits the right traffic, or the database is reachable. Consuming the stack outputs in a test action and asserting on real behaviour is the only option here that validates function. Option B catches template defects statically and cannot observe runtime behaviour. Option C compares live configuration to the template and will report no drift on a freshly created stack regardless of whether it works. Option D previews planned changes before deployment and again tests nothing at runtime."
 },
 {
  "id": "dop-83",
  "source": "authored",
  "domain": 2,
  "topic": "Tagging strategy",
  "difficulty": "easy",
  "multi": false,
  "question": "Finance cannot attribute costs because resources are inconsistently tagged, and some teams omit the cost centre tag entirely. Which combination enforces and reports on the standard going forward?",
  "choices": {
   "A": "Define a tag policy in AWS Organizations for the required tag keys and values, activate the tag as a cost allocation tag in Billing, and use an AWS Config rule to flag resources missing it.",
   "B": "Activate cost allocation tags in the Billing console and rely on the monthly report to identify gaps.",
   "C": "Apply an SCP that denies all resource creation, and grant exceptions manually as teams request them.",
   "D": "Use AWS Resource Groups to group resources by name prefix instead of tags."
  },
  "answer": [
   "A"
  ],
  "explanation": "The requirement has three parts and this option covers all of them: a tag policy declares the required keys and permitted values across the organisation, activating the tag as a cost allocation tag makes it appear in Cost Explorer and billing reports, and a Config rule such as the required-tags rule continuously reports resources that lack it. Option B gives visibility only after the fact and enforces nothing. Option C is a blunt denial that halts all work and creates a manual approval bottleneck. Option D substitutes naming conventions for tags, which billing cannot use for allocation."
 },
 {
  "id": "dop-84",
  "source": "authored",
  "domain": 2,
  "topic": "Blue/green infrastructure changes",
  "difficulty": "hard",
  "multi": false,
  "question": "A CloudFormation update changes a property on an Amazon ElastiCache cluster that forces replacement. The team must avoid any window where the application has no cache available. What is the safest approach?",
  "choices": {
   "A": "Add the new cluster alongside the existing one in the template, cut the application over to it through a configuration change, and remove the old cluster in a subsequent stack update.",
   "B": "Set UpdateReplacePolicy to Retain so the original cluster is kept while the new one is created.",
   "C": "Enable termination protection on the stack before running the update.",
   "D": "Run the update with rollback disabled so the replacement completes without interruption."
  },
  "answer": [
   "A"
  ],
  "explanation": "A replacing update creates the new resource and deletes the old one within a single stack operation, and the application's connection endpoint changes at an uncontrolled moment. Decomposing it into three deliberate steps — add, cut over, remove — keeps both resources alive during the transition so the switch happens under the team's control with no gap. Option B keeps the old cluster from being deleted but the stack still stops managing it and the cutover timing remains uncontrolled, leaving an orphaned resource. Option C protects the stack from deletion and has no effect on resource replacement. Option D changes failure behaviour, not the replacement sequence, and disabling rollback makes a failed update worse."
 },
 {
  "id": "dop-85",
  "source": "authored",
  "domain": 2,
  "topic": "Configuration deployment safety",
  "difficulty": "medium",
  "multi": false,
  "question": "A configuration change pushed through AWS AppConfig caused an outage because a malformed value reached every host at once. Which two AppConfig features, used together, would have prevented this?",
  "choices": {
   "A": "A validator on the configuration profile to reject malformed content, and a deployment strategy with a gradual growth factor plus a CloudWatch alarm for automatic rollback.",
   "B": "A larger bake time on the deployment strategy and a longer client polling interval.",
   "C": "An SSM Parameter Store SecureString and a KMS key policy restricting who may write the value.",
   "D": "A second AppConfig environment used as a staging target, deployed to at the same time as production."
  },
  "answer": [
   "A"
  ],
  "explanation": "AppConfig validators run before a deployment begins — either a JSON Schema check or a Lambda validator — so malformed content is rejected rather than distributed. The deployment strategy then controls exposure with a growth factor and interval, and associating a CloudWatch alarm with the environment lets AppConfig roll the configuration back automatically when the alarm fires. Together they stop bad content leaving the gate and limit the damage if a valid-but-wrong value gets through. Option B slows the rollout slightly but never validates or rolls back. Option C addresses secrecy and access control rather than correctness or exposure. Option D deploys to both targets simultaneously, so staging provides no early warning."
 },
 {
  "id": "dop-86",
  "source": "authored",
  "domain": 2,
  "topic": "Terraform state management",
  "difficulty": "medium",
  "multi": false,
  "question": "A team manages AWS infrastructure with Terraform run from a shared CI system. Two concurrent runs recently corrupted the state file. Which backend configuration prevents this?",
  "choices": {
   "A": "An S3 backend with versioning enabled for state history, combined with a state locking mechanism such as an Amazon DynamoDB table so only one run may hold the lock.",
   "B": "An S3 backend with server-side encryption enabled and a bucket policy restricting writes to the CI role.",
   "C": "A local backend on the CI worker with the state committed to the source repository after each run.",
   "D": "An S3 backend with Cross-Region Replication so a second copy of the state is always available."
  },
  "answer": [
   "A"
  ],
  "explanation": "Concurrent Terraform runs corrupt state because two processes read, modify and write the same object without coordination. State locking is the fix: the backend acquires a lock before any operation and releases it afterwards, so the second run waits. Versioning on the bucket adds recoverability if a bad write still occurs. Option B protects confidentiality and authorisation but two authorised runs still race. Option C makes the problem worse, since committing state creates merge conflicts and exposes state contents in source control. Option D duplicates the corruption to a second Region rather than preventing it."
 },
 {
  "id": "dop-87",
  "source": "authored",
  "domain": 2,
  "topic": "CloudFormation git sync",
  "difficulty": "medium",
  "multi": false,
  "question": "A small team wants a CloudFormation stack to be updated whenever the template changes in their git repository, without building a CodePipeline for it. Which capability provides this directly?",
  "choices": {
   "A": "CloudFormation Git sync, which connects a stack to a repository branch through AWS CodeConnections and deploys on commit using a deployment file that names the template and parameters.",
   "B": "A CloudFormation StackSet targeting the account, with automatic deployment enabled on the repository.",
   "C": "An S3 event notification on the bucket holding the template, invoking UpdateStack.",
   "D": "A CloudFormation macro that watches the repository and rewrites the template on commit."
  },
  "answer": [
   "A"
  ],
  "explanation": "Git sync links a CloudFormation stack directly to a branch through a CodeConnections connection: a deployment file in the repository declares the template path, parameters and tags, and CloudFormation tracks the branch and applies changes on commit, with sync status reported on the stack. No pipeline is required. Option B misapplies automatic deployment, which concerns accounts joining an organisational unit and has no repository integration. Option C requires the template to reach a bucket somehow and adds a function to call UpdateStack, which is the plumbing being avoided. Option D misunderstands macros, which transform template content during processing and cannot observe repositories."
 },
 {
  "id": "dop-88",
  "source": "authored",
  "domain": 2,
  "topic": "Stack policies",
  "difficulty": "medium",
  "multi": false,
  "question": "During a stack update an engineer accidentally modified a parameter that replaced a production DynamoDB table. The team wants future updates to fail rather than replace that specific table, while still allowing other resources to be updated freely. What should be applied?",
  "choices": {
   "A": "A stack policy denying Update:Replace and Update:Delete on the logical ID of the table, while allowing all update actions on all other resources.",
   "B": "An IAM policy denying dynamodb:DeleteTable for the deployment role.",
   "C": "A DeletionPolicy of Retain on the table resource.",
   "D": "Termination protection enabled on the stack."
  },
  "answer": [
   "A"
  ],
  "explanation": "Stack policies apply specifically during stack updates and are expressed against logical IDs with update actions, so denying Update:Replace and Update:Delete on that table makes any update that would replace it fail outright while leaving the rest of the stack updatable. Option B is close in spirit but CloudFormation replacement involves create-then-delete and denying the delete leaves a half-completed update and an orphaned table, and it would also block legitimate deletions. Option C preserves the old table's data but the replacement still happens and the application is switched to a new empty table. Option D prevents deleting the whole stack, which is a different event entirely."
 },
 {
  "id": "dop-89",
  "source": "authored",
  "domain": 2,
  "topic": "Custom SSM documents",
  "difficulty": "medium",
  "multi": false,
  "question": "A DevOps engineer needs the same log-collection procedure to run on Windows and Linux managed nodes, invoked identically from Run Command. What is the appropriate implementation?",
  "choices": {
   "A": "Author a custom Systems Manager command document with separate runCommand plugin steps guarded by platformType precondition values for Windows and Linux.",
   "B": "Author two separate documents and require the operator to choose the correct one for each node.",
   "C": "Author a single document containing only shell commands and rely on the SSM Agent to translate them for Windows.",
   "D": "Author an Automation runbook that invokes a Lambda function to SSH into each node."
  },
  "answer": [
   "A"
  ],
  "explanation": "Command documents support preconditions on steps, with platformType allowing a step to run only on Windows or only on Linux, so one document can carry both implementations and callers invoke it identically regardless of node platform. Option B pushes the platform decision onto the operator, which is the inconsistency being removed. Option C is impossible, since the agent executes commands with the native interpreter and does not translate shell syntax to PowerShell. Option D abandons the agent-based model for SSH, which requires network paths and credential management that Systems Manager exists to avoid."
 },
 {
  "id": "dop-90",
  "source": "authored",
  "domain": 2,
  "topic": "Session Manager auditing",
  "difficulty": "medium",
  "multi": true,
  "question": "A compliance requirement states that all interactive shell access to EC2 instances must be recorded, attributable to an individual, and possible without inbound SSH ports or bastion hosts. Which TWO configurations support this using AWS Systems Manager Session Manager?",
  "choices": {
   "A": "Enable session logging to Amazon S3 or CloudWatch Logs in Session Manager preferences, with KMS encryption of session data.",
   "B": "Grant access through IAM policies scoped to individual principals so each session is attributable and recorded in CloudTrail with the caller identity.",
   "C": "Open inbound port 22 from the Systems Manager service prefix list so the agent can establish the tunnel.",
   "D": "Attach an EC2 key pair to each instance so session activity can be traced to the key holder.",
   "E": "Deploy a hardened bastion host in a public subnet and require all sessions to pass through it."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Session Manager records session activity when logging is enabled in preferences, sending typed input and output to S3 or CloudWatch Logs, optionally encrypted with a customer managed key. Attribution comes from IAM: sessions are started through the API by a named principal, and CloudTrail records StartSession with that identity, so per-principal policies make every session traceable. Option C is wrong and unnecessary — the agent makes outbound connections to the Systems Manager endpoints, so no inbound port is opened. Option D attributes access to a shared key rather than a person and provides no recording. Option E reintroduces the bastion the requirement explicitly removes."
 },
 {
  "id": "dop-91",
  "source": "authored",
  "domain": 2,
  "topic": "EC2 Image Builder components",
  "difficulty": "medium",
  "multi": false,
  "question": "An EC2 Image Builder pipeline must install an internal agent, then verify the agent responds before the AMI is distributed. How should the recipe and pipeline be structured?",
  "choices": {
   "A": "Add a build component that installs the agent to the image recipe, and add a test component that queries the agent, so distribution occurs only if the test component succeeds.",
   "B": "Add both the installation and the verification commands to a single build component, since Image Builder halts on any non-zero exit.",
   "C": "Distribute the AMI first and run the verification as a Systems Manager association on instances launched from it.",
   "D": "Add the verification to the distribution configuration as a post-copy action."
  },
  "answer": [
   "A"
  ],
  "explanation": "Image Builder recipes distinguish build components, which mutate the image, from test components, which run against an instance launched from the newly built image after it is created. Test failures stop the pipeline before distribution, which is the gate described. Option B does halt on failure, but running the verification during the build tests the half-configured image rather than the finished one, and the distinction between build and test phases exists precisely to avoid that. Option C distributes an unverified image, so the failure is discovered by consumers. Option D invents a capability, since distribution configurations control Regions, accounts and naming rather than running tests."
 },
 {
  "id": "dop-92",
  "source": "authored",
  "domain": 2,
  "topic": "Template conditions",
  "difficulty": "medium",
  "multi": false,
  "question": "One CloudFormation template must serve both production, where a multi-AZ database and read replica are required, and development, where a single small instance suffices. The team wants one template and no separate copies. Which template feature should be used?",
  "choices": {
   "A": "Conditions evaluated from an environment parameter, applied with the Condition attribute on optional resources and with Fn::If on properties that differ.",
   "B": "Mappings keyed on the environment parameter, since mappings can omit resources entirely.",
   "C": "Nested stacks, with a different child template selected per environment.",
   "D": "Metadata entries describing which resources apply to which environment."
  },
  "answer": [
   "A"
  ],
  "explanation": "Conditions are evaluated from parameters and pseudo parameters, and a resource carrying a false Condition is simply not created, while Fn::If selects between property values. That covers both halves of the requirement — optional resources such as the read replica, and differing properties such as multi-AZ and instance class — in a single template. Option B is wrong on the key point: mappings select values but cannot omit a resource. Option C reintroduces separate templates, which the requirement excludes. Option D is inert, since Metadata carries information for tools and humans and never affects provisioning."
 },
 {
  "id": "dop-93",
  "source": "authored",
  "domain": 2,
  "topic": "Third-party resource providers",
  "difficulty": "hard",
  "multi": false,
  "question": "A team wants CloudFormation to manage a resource in a third-party monitoring product as a first-class resource, with drift detection and normal create, update and delete handling. Which approach should they take?",
  "choices": {
   "A": "Develop or install a resource type in the CloudFormation registry that implements the provider handlers, then use it in templates like any native resource type.",
   "B": "Write a Lambda-backed custom resource and invoke it from every template that needs the third-party resource.",
   "C": "Use a CloudFormation macro to expand a shorthand into the API calls needed to configure the product.",
   "D": "Define the resource in a Systems Manager Automation runbook triggered after the stack completes."
  },
  "answer": [
   "A"
  ],
  "explanation": "The CloudFormation registry supports private and third-party resource types, implemented with create, read, update, delete and list handlers. Because the read handler exists, CloudFormation can perform drift detection and manage the resource with the same semantics as native types — the distinguishing requirement here. Option B works for provisioning but custom resources do not participate in drift detection and each template must carry the service token plumbing. Option C only rewrites template content during processing and cannot call external APIs as part of the resource lifecycle. Option D detaches the resource from the stack lifecycle entirely, so deletion and rollback are unmanaged."
 },
 {
  "id": "dop-94",
  "source": "authored",
  "domain": 2,
  "topic": "Configuration management migration",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs Chef cookbooks on EC2 instances through a self-managed configuration management server that is expensive to operate. They want an AWS-native replacement that applies desired state on a schedule, reports compliance and requires no servers to manage. What should they adopt?",
  "choices": {
   "A": "AWS Systems Manager State Manager associations with custom documents, using Systems Manager Compliance for reporting.",
   "B": "AWS CodeDeploy deployment groups running the cookbooks as lifecycle hooks.",
   "C": "Amazon EC2 user data scripts executed at every instance launch.",
   "D": "AWS Config custom rules that evaluate and correct instance configuration."
  },
  "answer": [
   "A"
  ],
  "explanation": "State Manager applies a defined state to managed nodes on a schedule with no infrastructure to run, and association compliance is surfaced through Systems Manager Compliance, which together replace the scheduled convergence and reporting a configuration management server provides. Option B is a deployment tool: it runs on release events rather than continuously, and has no compliance model for desired state. Option C runs only at launch and cannot correct drift on running instances. Option D evaluates AWS resource configuration and, while remediation exists, it is not a mechanism for managing in-guest state such as packages and files."
 },
 {
  "id": "dop-95",
  "source": "authored",
  "domain": 2,
  "topic": "Parameter validation",
  "difficulty": "easy",
  "multi": false,
  "question": "A CloudFormation template accepts an instance type as a parameter, and stack creations occasionally fail late because someone supplies an unsupported value. How can the template reject invalid input before any resource is created?",
  "choices": {
   "A": "Add AllowedValues to the parameter definition so CloudFormation validates the input at the start of the operation.",
   "B": "Add a Condition that compares the parameter to a list and fails the stack if no match is found.",
   "C": "Add a custom resource at the top of the template that validates the parameter and returns an error.",
   "D": "Add a Description to the parameter listing the supported instance types."
  },
  "answer": [
   "A"
  ],
  "explanation": "Parameter constraints such as AllowedValues, AllowedPattern, MinLength and MaxLength are validated by CloudFormation before the operation starts, so an invalid instance type is rejected immediately with a clear message and nothing is provisioned. Option B cannot fail a stack on its own, since conditions select whether resources and property values apply rather than raising errors. Option C validates only once the stack is underway and depends on a Lambda function existing and responding correctly. Option D is documentation and enforces nothing."
 },
 {
  "id": "dop-96",
  "source": "authored",
  "domain": 2,
  "topic": "Secrets rotation and configuration",
  "difficulty": "medium",
  "multi": false,
  "question": "An application reads a database credential from AWS Secrets Manager at startup and caches it for the life of the process. After automatic rotation was enabled, instances began failing hours after each rotation. What is the correct fix?",
  "choices": {
   "A": "Update the application to handle authentication failures by refetching the secret and retrying, so it picks up the current credential after rotation.",
   "B": "Disable automatic rotation and rotate the credential manually during maintenance windows.",
   "C": "Increase the rotation interval so instances are replaced before the credential changes.",
   "D": "Store the credential in an environment variable populated at instance launch instead."
  },
  "answer": [
   "A"
  ],
  "explanation": "Rotation changes the credential while long-lived processes hold a cached copy, so the application must treat an authentication failure as a signal to refetch the secret and retry rather than as a fatal error. This is the standard client-side pattern and is what the AWS secrets caching libraries implement. Option B removes the automation and leaves the same caching bug waiting for the next manual rotation. Option C makes failures rarer rather than fixing them and ties correctness to instance lifetime. Option D freezes the credential at launch, which is the same caching problem expressed at the infrastructure layer."
 },
 {
  "id": "dop-97",
  "source": "authored",
  "domain": 2,
  "topic": "Multi-account template distribution",
  "difficulty": "medium",
  "multi": false,
  "question": "A StackSet update must reach 40 accounts across 4 Regions. The team wants Regions updated one after another so a Region-specific failure does not affect the others, while accounts within a Region update concurrently. Which setting controls this?",
  "choices": {
   "A": "Region concurrency set to SEQUENTIAL, with the maximum concurrent count controlling how many accounts update simultaneously within each Region.",
   "B": "Region concurrency set to PARALLEL, with a failure tolerance of zero.",
   "C": "Automatic deployment enabled, with the Region order determined by the account creation date.",
   "D": "A separate StackSet per Region, each triggered by the previous one on completion."
  },
  "answer": [
   "A"
  ],
  "explanation": "StackSet operation preferences include a region concurrency type. SEQUENTIAL processes the Region list one Region at a time in the order given, while the maximum concurrent count and percentage govern how many accounts are updated at once inside the Region being processed — exactly the behaviour described. Option B does the opposite by updating all Regions at once. Option C conflates automatic deployment, which concerns accounts joining an organisational unit, with rollout ordering. Option D achieves a similar effect but multiplies the number of StackSets to maintain and requires custom chaining that the built-in setting provides."
 },
 {
  "id": "dop-98",
  "source": "authored",
  "domain": 2,
  "topic": "Handling stack drift remediation",
  "difficulty": "hard",
  "multi": false,
  "question": "Drift detection reports that a security group managed by CloudFormation has an extra inbound rule added manually. The team wants the stack to become the source of truth again without any resource being recreated. What should they do?",
  "choices": {
   "A": "Run a stack update with the unchanged template, so CloudFormation reconciles the drifted property back to the declared configuration in place.",
   "B": "Delete and recreate the stack so all resources match the template exactly.",
   "C": "Import the security group into a new stack to reset its managed state.",
   "D": "Update the template to include the manually added rule, so the drift report clears."
  },
  "answer": [
   "A"
  ],
  "explanation": "For a property that can be modified in place, such as a security group ingress rule, running an update against the existing template makes CloudFormation compare declared state to actual state and correct the difference without replacing the resource, which is the least disruptive path back to the template as source of truth. Option B destroys and rebuilds everything, including resources with data. Option C addresses unmanaged resources rather than drifted managed ones and does not remove the extra rule. Option D silences the alert by ratifying an unreviewed manual change, which may be the right answer occasionally but is not reconciliation and should be a deliberate decision rather than a way to clear a report."
 },
 {
  "id": "dop-99",
  "source": "authored",
  "domain": 3,
  "topic": "DR strategy selection",
  "difficulty": "hard",
  "multi": false,
  "question": "A business requires an RTO of 10 minutes and an RPO of 1 minute for a relational workload, and wants to minimise the cost of the standby Region. Which disaster recovery strategy is the best fit?",
  "choices": {
   "A": "Warm standby: a scaled-down but fully functional copy of the workload running continuously in the second Region with database replication, scaled up on failover.",
   "B": "Backup and restore: cross-Region backup copies restored into new infrastructure when a disaster is declared.",
   "C": "Pilot light: data replicated continuously with core infrastructure switched off until needed.",
   "D": "Multi-site active-active: full production capacity serving traffic in both Regions at all times."
  },
  "answer": [
   "A"
  ],
  "explanation": "A 1-minute RPO requires continuous replication, and a 10-minute RTO leaves no time to provision and boot an environment, so something functional must already be running. Warm standby meets both — a smaller always-on copy that scales up on failover — while costing far less than full duplicate capacity. Option B cannot meet either objective, since restoring databases and provisioning infrastructure takes hours. Option C meets the RPO but pilot light keeps servers switched off, so starting and warming them typically exceeds a 10-minute RTO. Option D meets the objectives comfortably but is the most expensive option, which the requirement asks to minimise."
 },
 {
  "id": "dop-100",
  "source": "authored",
  "domain": 3,
  "topic": "Auto Scaling lifecycle hooks",
  "difficulty": "medium",
  "multi": false,
  "question": "Instances in an Auto Scaling group are terminated during scale-in while still processing long-running jobs, causing work to be lost. The team needs up to 10 minutes to drain work before termination completes. What should be configured?",
  "choices": {
   "A": "A termination lifecycle hook that puts the instance into Terminating:Wait, with the application signalling CompleteLifecycleAction when draining finishes, and a heartbeat timeout covering the drain period.",
   "B": "A longer health check grace period on the Auto Scaling group.",
   "C": "Instance scale-in protection on every instance in the group.",
   "D": "A target tracking policy with a longer cooldown period."
  },
  "answer": [
   "A"
  ],
  "explanation": "A lifecycle hook on instance termination holds the instance in the Terminating:Wait state for the heartbeat timeout, giving the application a defined window to finish work; calling CompleteLifecycleAction releases it early once draining is done. That is the mechanism designed for graceful shutdown. Option B controls how long health checks are ignored after launch, which concerns startup, not termination. Option C prevents instances being chosen for scale-in at all, so the group can never scale in, which is not the requirement. Option D changes how often scaling activities occur rather than what happens to an instance being terminated."
 },
 {
  "id": "dop-101",
  "source": "authored",
  "domain": 3,
  "topic": "Route 53 failover",
  "difficulty": "medium",
  "multi": true,
  "question": "A web application runs in two Regions behind Application Load Balancers. Traffic must go to the primary Region normally and switch to the secondary Region automatically when the primary becomes unhealthy. Which TWO components are required?",
  "choices": {
   "A": "A Route 53 health check evaluating an endpoint in the primary Region, or a calculated health check aggregating several checks.",
   "B": "Route 53 failover routing records, with the primary record associated with the health check and a secondary record for the other Region.",
   "C": "A Route 53 latency routing policy across both Regional endpoints.",
   "D": "An Application Load Balancer target group containing targets in both Regions.",
   "E": "A CloudFront distribution with both load balancers configured as origins in an origin group."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "DNS failover in Route 53 needs two pieces: a health check that determines whether the primary endpoint is healthy, and a pair of records with the failover routing policy where the primary record is associated with that health check and the secondary answers when the primary is unhealthy. Option C routes on latency rather than health preference, so it does not implement an ordered primary and standby. Option D is not possible, because ALB target groups cannot contain targets in another Region. Option E is a genuine alternative failover mechanism at the CloudFront layer, but it is not a required component of the Route 53 design described and would change the architecture."
 },
 {
  "id": "dop-102",
  "source": "authored",
  "domain": 3,
  "topic": "Aurora Global Database",
  "difficulty": "medium",
  "multi": false,
  "question": "A company needs a relational database in a second Region with typical replication lag under a second and the ability to promote the secondary Region quickly during a Regional impairment. Which option meets this best?",
  "choices": {
   "A": "An Amazon Aurora global database, with the secondary Region cluster promoted to a standalone primary during a failover.",
   "B": "An Amazon RDS Multi-AZ deployment, which places a standby in a second Availability Zone.",
   "C": "Cross-Region automated backup copies restored into the secondary Region when needed.",
   "D": "A read replica chain across three Regions to reduce load on the primary."
  },
  "answer": [
   "A"
  ],
  "explanation": "Aurora global databases replicate at the storage layer to a secondary Region with typical lag under a second, and the secondary cluster can be promoted to a full read/write primary, which is exactly the described requirement. Option B is a common trap: Multi-AZ protects against Availability Zone failure within one Region and provides no cross-Region capability. Option C has an RPO measured in hours and an RTO measured in the time to restore, far short of the requirement. Option D provides cross-Region read capacity but chained replicas add lag at each hop and this describes scaling reads rather than a promotion path."
 },
 {
  "id": "dop-103",
  "source": "authored",
  "domain": 3,
  "topic": "Static stability",
  "difficulty": "hard",
  "multi": false,
  "question": "A workload runs across three Availability Zones and must survive the loss of one zone without any scaling action, since new capacity may be unobtainable during a large-scale event. How should the fleet be sized?",
  "choices": {
   "A": "Provision enough always-on capacity in each of the three zones that any two zones together can carry 100% of peak load, so no scaling is needed after a zone is lost.",
   "B": "Run minimum capacity in each zone and rely on a target tracking policy to add instances when a zone fails.",
   "C": "Run all capacity in one zone with a warm standby in a second zone, activated on failure.",
   "D": "Run the fleet across three zones and rely on the Auto Scaling group to rebalance instances into the remaining zones."
  },
  "answer": [
   "A"
  ],
  "explanation": "Static stability means the system keeps working after a failure without needing a control plane action or new capacity, which is important precisely because those are the things most likely to be degraded during a large event. Sizing the fleet so that any two of three zones can carry full peak load — roughly 150% of peak spread evenly — meets that. Options B and D both depend on obtaining new instances at the moment of failure, which is the dependency the requirement removes. Option C concentrates risk in a single zone and depends on an activation step, which is also a scaling action taken during the event."
 },
 {
  "id": "dop-104",
  "source": "authored",
  "domain": 3,
  "topic": "Queue-based decoupling",
  "difficulty": "medium",
  "multi": false,
  "question": "A front-end service calls a downstream processor synchronously. When the processor slows down, the front end exhausts its threads and the whole application becomes unavailable. Which change most directly addresses this failure mode?",
  "choices": {
   "A": "Place an Amazon SQS queue between the two services so the front end enqueues work and returns immediately, with the processor consuming at its own rate and a dead-letter queue capturing poison messages.",
   "B": "Increase the front-end instance size so it has more threads available.",
   "C": "Add a retry with exponential backoff to the front end for calls to the processor.",
   "D": "Add an Application Load Balancer in front of the processor to spread the load."
  },
  "answer": [
   "A"
  ],
  "explanation": "The failure is backpressure propagating from a slow dependency into the caller until its resources are exhausted. A queue breaks that coupling: the producer completes as soon as the message is durably enqueued, the consumer processes at whatever rate it can, and a backlog becomes queue depth rather than a front-end outage. A dead-letter queue keeps individual bad messages from stalling the consumer. Option B raises the exhaustion threshold without changing the dynamic. Option C usually makes it worse by adding load to an already struggling dependency. Option D distributes requests but does nothing when the processor as a whole is slow."
 },
 {
  "id": "dop-105",
  "source": "authored",
  "domain": 3,
  "topic": "Instance refresh",
  "difficulty": "medium",
  "multi": false,
  "question": "A new AMI must be rolled out to an Auto Scaling group of 40 instances, replacing them gradually while keeping at least 90% of capacity in service, and stopping if the new instances fail health checks. Which feature provides this natively?",
  "choices": {
   "A": "An Auto Scaling instance refresh with a minimum healthy percentage of 90 and a checkpoint or instance warmup configured, which replaces instances in batches and cancels on failure.",
   "B": "Updating the launch template and waiting for natural instance turnover through scaling activities.",
   "C": "Doubling the desired capacity and then halving it so the older instances are terminated first.",
   "D": "Suspending the AZRebalance process and terminating instances manually in small groups."
  },
  "answer": [
   "A"
  ],
  "explanation": "Instance refresh is the built-in rolling replacement mechanism for an Auto Scaling group: it honours a minimum healthy percentage, waits for instance warmup before counting a replacement as healthy, supports checkpoints for staged rollouts, and cancels the refresh if replacements fail. Option B is not a rollout at all, since instances may live for weeks and the fleet ends up running mixed versions indefinitely. Option C relies on undocumented termination ordering and doubles cost with no health gating. Option D is manual, error prone at 40 instances, and provides no automatic stop condition."
 },
 {
  "id": "dop-106",
  "source": "authored",
  "domain": 3,
  "topic": "Step Functions error handling",
  "difficulty": "medium",
  "multi": false,
  "question": "A Step Functions workflow calls a third-party API that intermittently returns throttling errors and occasionally fails permanently. The workflow must retry transient failures and route permanent failures to a compensating step. How should the state machine be defined?",
  "choices": {
   "A": "Add a Retry block on the task matching the throttling error with backoff rate and maximum attempts, and a Catch block matching the permanent error type that transitions to the compensation state.",
   "B": "Wrap the API call in a Lambda function that loops internally until it succeeds or the function times out.",
   "C": "Add a Wait state before the task so the API has time to recover.",
   "D": "Set the state machine type to Express so failed executions are automatically replayed."
  },
  "answer": [
   "A"
  ],
  "explanation": "Retry and Catch are the native error-handling constructs of the Amazon States Language. Retry matches error names, applies an interval, backoff rate and maximum attempt count for transient conditions, and Catch routes a matching error to another state, which is where compensation belongs. This keeps the retry logic declarative and visible in the execution history. Option B hides retries inside a function, burning billed duration and risking a timeout that loses all context. Option C delays every execution regardless of whether anything is failing. Option D misstates Express workflows, which change execution semantics and billing but do not replay failures automatically."
 },
 {
  "id": "dop-107",
  "source": "authored",
  "domain": 3,
  "topic": "Lambda concurrency controls",
  "difficulty": "hard",
  "multi": false,
  "question": "A Lambda function connected to a small RDS instance exhausts the database connection pool during traffic spikes, and its bursts also starve other functions in the account of concurrency. What should a DevOps engineer configure?",
  "choices": {
   "A": "Set reserved concurrency on the function to cap its simultaneous executions at a level the database can support, which also guarantees that capacity is not consumed by other functions.",
   "B": "Set provisioned concurrency on the function so instances are pre-warmed and connections are reused.",
   "C": "Increase the function timeout so invocations wait for a free database connection.",
   "D": "Move the function into a VPC so connections to the database are pooled by the elastic network interface."
  },
  "answer": [
   "A"
  ],
  "explanation": "Reserved concurrency does two things at once, which is why it fits both symptoms: it caps the function's maximum simultaneous executions, protecting the database from more connections than it can serve, and it carves that concurrency out of the account pool so this function can neither exceed nor be starved by others. Option B reduces cold starts by keeping environments initialised but places no ceiling on scaling, so the database is still overwhelmed. Option C makes invocations hold resources longer, deepening the exhaustion. Option D misunderstands VPC networking, which provides connectivity and does not pool database connections."
 },
 {
  "id": "dop-108",
  "source": "authored",
  "domain": 3,
  "topic": "Chaos engineering",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants to verify that their multi-AZ application really survives the loss of an Availability Zone, by injecting the failure in a controlled way with automatic stop conditions if customer impact appears. Which AWS service should they use?",
  "choices": {
   "A": "AWS Fault Injection Service, running an experiment template with AZ impairment actions and CloudWatch alarms configured as stop conditions.",
   "B": "AWS Resilience Hub, which scores the application against its resilience policy.",
   "C": "Amazon CloudWatch Synthetics canaries, which continuously probe the application endpoints.",
   "D": "AWS Trusted Advisor, which reports fault tolerance findings for the account."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Fault Injection Service is the managed chaos engineering service: experiment templates declare actions such as impairing a subnet or stopping instances, targets select the resources, and stop conditions bound to CloudWatch alarms halt and roll back the experiment automatically if impact crosses a threshold. Option B assesses architecture against a policy and estimates RTO and RPO, but it does not inject faults. Option C monitors availability continuously and would observe the impact rather than cause it. Option D produces static best-practice checks with no experimentation capability."
 },
 {
  "id": "dop-109",
  "source": "authored",
  "domain": 3,
  "topic": "CloudFront origin failover",
  "difficulty": "medium",
  "multi": false,
  "question": "A static site served by CloudFront from an S3 bucket must continue serving content if the primary bucket's Region becomes unavailable. Which configuration provides automatic failover at the CDN layer?",
  "choices": {
   "A": "An origin group containing the primary and secondary buckets, with failover criteria listing the HTTP status codes that trigger a retry against the secondary origin.",
   "B": "Two CloudFront distributions with a Route 53 failover record set between them.",
   "C": "S3 Cross-Region Replication from the primary to the secondary bucket, with CloudFront pointed at the primary.",
   "D": "An S3 Multi-Region Access Point used as the distribution origin, with an Application Load Balancer in front."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudFront origin groups pair a primary and a secondary origin with a list of failover status codes; when the primary returns one of them or times out, CloudFront retries the request against the secondary transparently to the viewer. Option B works at DNS resolution rather than per request, so it is slower to react and requires duplicate distributions. Option C is necessary so the second bucket actually has the content, but replication alone changes nothing about where CloudFront sends requests. Option D names a real feature for multi-Region S3 access, but placing a load balancer in front of it is not a valid CloudFront origin architecture for this case."
 },
 {
  "id": "dop-110",
  "source": "authored",
  "domain": 3,
  "topic": "DynamoDB multi-Region",
  "difficulty": "medium",
  "multi": false,
  "question": "An application must serve low-latency reads and writes to users in three Regions from the same dataset, with each Region able to accept writes. Which configuration meets this?",
  "choices": {
   "A": "A DynamoDB global table with replicas in all three Regions, which replicates writes between Regions and resolves conflicts on a last-writer-wins basis.",
   "B": "A DynamoDB table in one Region with global secondary indexes projecting attributes for the other Regions.",
   "C": "A DynamoDB table in one Region with DynamoDB Accelerator clusters deployed in the other two Regions.",
   "D": "A DynamoDB table in one Region with on-demand backups copied to the other Regions every hour."
  },
  "answer": [
   "A"
  ],
  "explanation": "Global tables give a multi-active configuration: each Region hosts a replica that accepts reads and writes, changes propagate to the other replicas, and concurrent conflicting writes are reconciled with last-writer-wins semantics — the exact model described. Option B misunderstands global secondary indexes, which are alternate access patterns within a single Region and single table. Option C places a cache in remote Regions but writes still traverse to the single table's Region and the cache offers no write path. Option D is a backup strategy, not replication, and hourly copies serve no live traffic."
 },
 {
  "id": "dop-111",
  "source": "authored",
  "domain": 3,
  "topic": "Backup automation",
  "difficulty": "medium",
  "multi": true,
  "question": "An organisation must guarantee that all EBS volumes, RDS databases and DynamoDB tables across every member account are backed up on a defined schedule, retained for seven years, and protected from deletion by an account administrator. Which TWO capabilities support this?",
  "choices": {
   "A": "AWS Backup policies applied through AWS Organizations, so backup plans are enforced centrally across member accounts.",
   "B": "AWS Backup Vault Lock in compliance mode, which prevents deletion of recovery points before their retention period expires, even by the account root user.",
   "C": "Amazon Data Lifecycle Manager policies, which cover EBS, RDS and DynamoDB from a single policy definition.",
   "D": "An S3 Object Lock legal hold applied to the backup vault bucket.",
   "E": "An SCP denying the DeleteBackup action, applied to the management account."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Backup policies in AWS Organizations push backup plans to member accounts so coverage is enforced centrally rather than relying on each team. Vault Lock in compliance mode makes retention immutable — once the lock is committed, no principal, including the root user or AWS itself, can shorten retention or delete recovery points early, which is the tamper-resistance required. Option C is wrong because Data Lifecycle Manager covers EBS snapshots and AMIs, not RDS or DynamoDB. Option D misunderstands backup vaults, which are not customer S3 buckets. Option E applies an SCP to the management account, which is not affected by SCPs in the way member accounts are, and a deny alone can be lifted by whoever manages the policy."
 },
 {
  "id": "dop-112",
  "source": "authored",
  "domain": 3,
  "topic": "Service quotas as a failure mode",
  "difficulty": "hard",
  "multi": false,
  "question": "During a traffic surge an application failed to scale because the account hit its EC2 vCPU limit. The team wants advance warning before any quota becomes a constraint again. What should they implement?",
  "choices": {
   "A": "Create CloudWatch alarms on the Service Quotas usage metrics for the relevant quotas, alerting when utilisation crosses a threshold such as 80%.",
   "B": "Request the maximum possible quota increase for every service in the account.",
   "C": "Enable Auto Scaling predictive scaling so capacity is provisioned before the surge.",
   "D": "Add a second Availability Zone so the fleet has more capacity available."
  },
  "answer": [
   "A"
  ],
  "explanation": "Service Quotas publishes usage metrics to CloudWatch for supported quotas, so an alarm on the utilisation percentage gives exactly the advance warning requested, with time to request an increase before the limit is reached. Option B is impractical, since increases are per-quota and require justification, and it does not warn about the many quotas that were not raised. Option C helps provision ahead of predictable demand but the scaling still fails once the vCPU limit is hit — quotas bound the ceiling regardless of when capacity is requested. Option D misdiagnoses the failure: vCPU quotas are Regional, so spreading across zones does not raise them."
 },
 {
  "id": "dop-113",
  "source": "authored",
  "domain": 3,
  "topic": "Auto Scaling health checks",
  "difficulty": "medium",
  "multi": false,
  "question": "An Auto Scaling group behind an Application Load Balancer keeps instances that the load balancer marks unhealthy, because the group only replaces instances that fail EC2 status checks. What should be changed?",
  "choices": {
   "A": "Add ELB as a health check type on the Auto Scaling group so it replaces instances that the load balancer reports unhealthy, and set a health check grace period long enough for application startup.",
   "B": "Reduce the load balancer health check interval so unhealthy instances are detected sooner.",
   "C": "Enable connection draining on the target group so unhealthy instances stop receiving traffic.",
   "D": "Configure a scheduled scaling action that recycles the fleet nightly."
  },
  "answer": [
   "A"
  ],
  "explanation": "By default an Auto Scaling group uses EC2 status checks, which report on the hypervisor and instance reachability and say nothing about whether the application responds. Adding the ELB health check type makes the group act on the load balancer's view and replace application-level failures, while the grace period prevents a still-booting instance from being killed prematurely. Option B detects the problem faster but the group still does nothing about it. Option C affects how in-flight requests are handled during deregistration, not instance replacement. Option D limits how long a broken instance persists but leaves it serving errors for up to a day."
 },
 {
  "id": "dop-114",
  "source": "authored",
  "domain": 3,
  "topic": "Auto Scaling warm pools",
  "difficulty": "medium",
  "multi": false,
  "question": "An application takes eight minutes to initialise on launch, so scale-out events do not add usable capacity fast enough during traffic spikes. The team wants pre-initialised instances available immediately, without paying full price for idle running instances. What should be configured?",
  "choices": {
   "A": "An Auto Scaling warm pool holding pre-initialised instances in the Stopped state, which are started and placed into service when the group scales out.",
   "B": "A higher desired capacity so spare instances are always running and ready.",
   "C": "Provisioned capacity reservations in the Availability Zones used by the group.",
   "D": "A scheduled scaling action that raises capacity before each expected spike."
  },
  "answer": [
   "A"
  ],
  "explanation": "A warm pool keeps instances that have already completed their lengthy initialisation, held in a Stopped or Hibernated state so only storage is billed rather than compute. On scale-out they are started and enter service in the time it takes to boot rather than the full eight minutes. Option B eliminates the delay but pays full price for permanently idle capacity, which the requirement excludes. Option C reserves the right to launch instances but the launched instances still take eight minutes to initialise. Option D works only for spikes that are known in advance, and the question describes unpredictable traffic."
 },
 {
  "id": "dop-115",
  "source": "authored",
  "domain": 3,
  "topic": "Spot interruption handling",
  "difficulty": "medium",
  "multi": true,
  "question": "A batch processing fleet runs on EC2 Spot Instances. The team must minimise lost work when instances are reclaimed. Which TWO practices address this?",
  "choices": {
   "A": "Handle the EC2 Spot instance interruption notice, which gives a two-minute warning, by checkpointing progress and stopping work cleanly.",
   "B": "Use a capacity-optimized allocation strategy across several instance types and Availability Zones to reduce the frequency of interruptions.",
   "C": "Set the Spot maximum price to the On-Demand price so instances are never interrupted.",
   "D": "Enable termination protection on the Spot Instances so they cannot be reclaimed.",
   "E": "Use a single large instance type so fewer interruptions occur overall."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Two complementary practices apply: react well to interruptions by consuming the two-minute interruption notice from instance metadata or EventBridge and checkpointing, and reduce how often they happen by diversifying across instance types and zones with the capacity-optimized allocation strategy, which selects pools with the deepest spare capacity. Option C is a persistent misconception — price is not why instances are reclaimed; EC2 reclaims capacity when it is needed, regardless of the maximum price. Option D does not apply to Spot interruptions, which are not user-initiated terminations. Option E concentrates the fleet into one pool, which typically raises interruption risk rather than lowering it."
 },
 {
  "id": "dop-116",
  "source": "authored",
  "domain": 3,
  "topic": "Application Recovery Controller",
  "difficulty": "hard",
  "multi": false,
  "question": "A multi-Region active-standby application needs a failover mechanism that works reliably even when the primary Region's control planes are impaired, and that prevents an operator from failing over into a Region that is not ready to take traffic. Which service capability provides this?",
  "choices": {
   "A": "Amazon Route 53 Application Recovery Controller, using routing controls backed by a highly available cluster for the failover switch and readiness checks to confirm the standby Region is provisioned to handle the load.",
   "B": "Amazon Route 53 health checks with a calculated health check across the primary Region endpoints.",
   "C": "AWS Global Accelerator with traffic dials set to zero for the standby endpoint group.",
   "D": "AWS Resilience Hub assessments run before each failover decision."
  },
  "answer": [
   "A"
  ],
  "explanation": "Application Recovery Controller is built for exactly this problem. Routing controls are simple on-off switches hosted on a cluster of five Regional endpoints so the failover action itself does not depend on the impaired Region, and readiness checks continuously audit whether the standby has the capacity, quotas and configuration to receive traffic, so a failover into an unprepared Region can be blocked by safety rules. Option B relies on health check evaluation and DNS propagation and offers no readiness auditing. Option C can shift traffic but the dial change is a data plane control with no readiness verification. Option D is an assessment tool used in design and review, not a failover mechanism."
 },
 {
  "id": "dop-117",
  "source": "authored",
  "domain": 3,
  "topic": "Idempotency in distributed systems",
  "difficulty": "hard",
  "multi": false,
  "question": "An order processing Lambda function consumes messages from a standard SQS queue. Occasionally a customer is charged twice. What is the correct explanation and remedy?",
  "choices": {
   "A": "Standard queues provide at-least-once delivery, so the consumer must be idempotent — for example by recording a processed message or order identifier in a conditional DynamoDB write and skipping messages already seen.",
   "B": "The visibility timeout is too long, so messages are redelivered before processing completes; shortening it prevents duplicates.",
   "C": "The function has too much reserved concurrency, so two instances receive the same message; reducing concurrency to one prevents duplicates.",
   "D": "The dead-letter queue is redriving messages automatically; disabling redrive prevents duplicates."
  },
  "answer": [
   "A"
  ],
  "explanation": "Standard SQS queues guarantee at-least-once delivery, so occasional duplicates are expected behaviour rather than a misconfiguration, and the only robust fix is to make processing idempotent — commonly a conditional write on a deduplication key so the second attempt is detected and skipped. Option B has the effect backwards: a visibility timeout that is too short causes redelivery while the first invocation is still working; lengthening rather than shortening it helps, and it still cannot eliminate duplicates. Option C serialises processing at great cost and does not prevent the same message being delivered twice in sequence. Option D describes an operator-initiated action that does not run on its own."
 },
 {
  "id": "dop-118",
  "source": "authored",
  "domain": 3,
  "topic": "EventBridge reliability",
  "difficulty": "medium",
  "multi": false,
  "question": "An EventBridge rule invokes a Lambda target that occasionally fails. The team must ensure no event is silently lost and that failed events can be inspected and reprocessed later. What should be configured?",
  "choices": {
   "A": "A dead-letter queue on the rule target, together with a retry policy specifying the maximum age and retry attempts for the event.",
   "B": "An archive on the event bus with a 30-day retention period.",
   "C": "A second rule matching the same pattern with a different target for redundancy.",
   "D": "Increased Lambda reserved concurrency so invocations are not throttled."
  },
  "answer": [
   "A"
  ],
  "explanation": "EventBridge target configuration supports a retry policy — maximum event age and maximum retry attempts — and a dead-letter queue that receives events which could not be delivered after those retries. That makes failures durable and inspectable, and the queue can be redriven once the target is fixed. Option B preserves a copy of events that arrived on the bus and supports replay, which is useful, but it does not distinguish delivered from failed events, so it does not tell you what was lost. Option C duplicates every event to a second target rather than capturing failures. Option D addresses one specific cause of failure and still loses events from any other cause."
 },
 {
  "id": "dop-119",
  "source": "authored",
  "domain": 3,
  "topic": "Health check design",
  "difficulty": "hard",
  "multi": false,
  "question": "A service's load balancer health check queries an endpoint that verifies connectivity to the database. When the database had a brief problem, every instance failed its health check simultaneously and the entire fleet was removed from service, turning a partial degradation into a total outage. What is the recommended change?",
  "choices": {
   "A": "Make the load balancer health check shallow, verifying only that the local process can serve requests, and monitor dependency health separately with alarms rather than by removing instances from service.",
   "B": "Increase the health check unhealthy threshold so more consecutive failures are required before an instance is removed.",
   "C": "Add a second target group with a different health check path so at least one group remains healthy.",
   "D": "Configure the Auto Scaling group to replace instances that fail the health check so fresh instances are launched."
  },
  "answer": [
   "A"
  ],
  "explanation": "A deep health check that tests a shared dependency correlates every instance's health, so a dependency blip removes the whole fleet at once — precisely the failure described. The guidance is to keep the load balancer check shallow and local, so it answers whether this instance can serve, and to observe dependency health through metrics and alarms where the response can be graceful degradation rather than mass deregistration. Option B delays the same outcome without changing the correlation. Option C duplicates the same dependency test in both groups. Option D is actively harmful here, since replacing every instance during a database problem removes capacity and adds a thundering herd of new connections when the database recovers."
 },
 {
  "id": "dop-120",
  "source": "authored",
  "domain": 3,
  "topic": "ECS capacity providers",
  "difficulty": "medium",
  "multi": false,
  "question": "An ECS cluster on EC2 frequently has tasks stuck in PROVISIONING because there is no room on the container instances, and the Auto Scaling group does not know tasks are waiting. What should be configured?",
  "choices": {
   "A": "An ECS capacity provider with managed scaling associated with the Auto Scaling group, so the CapacityProviderReservation metric drives scaling based on the capacity tasks require.",
   "B": "A target tracking scaling policy on the Auto Scaling group based on average CPU utilisation of the container instances.",
   "C": "A larger task placement strategy spread across Availability Zones.",
   "D": "Service Auto Scaling on the ECS service based on the number of running tasks."
  },
  "answer": [
   "A"
  ],
  "explanation": "The gap is that instance-level metrics do not express unplaced task demand. A capacity provider with managed scaling closes it: ECS publishes the CapacityProviderReservation metric reflecting how much capacity the tasks need versus what exists, and an ECS-managed scaling policy on the Auto Scaling group acts on it, adding instances when tasks cannot be placed. Option B scales on the utilisation of instances that are already full, which is a poor proxy and reacts late or not at all. Option C changes where tasks are placed, not how much capacity exists. Option D scales the number of tasks, which makes the shortage worse rather than adding instances."
 },
 {
  "id": "dop-121",
  "source": "authored",
  "domain": 3,
  "topic": "Retry storms and backoff",
  "difficulty": "hard",
  "multi": false,
  "question": "After a brief downstream outage, a fleet of clients retried simultaneously and prevented the service from recovering. Which client-side change best prevents this pattern?",
  "choices": {
   "A": "Exponential backoff with jitter, plus a circuit breaker that stops sending requests entirely while the dependency is failing and probes occasionally to detect recovery.",
   "B": "A fixed retry interval of five seconds with an unlimited retry count so no request is lost.",
   "C": "An increased connection timeout so clients wait longer before deciding a request failed.",
   "D": "More client instances so retries are spread across more sources."
  },
  "answer": [
   "A"
  ],
  "explanation": "Synchronised retries produce a thundering herd that keeps a recovering service saturated. Exponential backoff spreads attempts out over time and jitter breaks the synchronisation between clients so they do not all retry at the same instant; a circuit breaker goes further by shedding load entirely while the dependency is known to be failing, allowing it to recover, and probing periodically. Option B is the pattern that causes the problem, since fixed intervals keep clients in lockstep and unlimited retries never relieve the pressure. Option C holds resources longer on both sides and delays failure detection. Option D increases the number of retrying clients, which amplifies the storm."
 },
 {
  "id": "dop-122",
  "source": "authored",
  "domain": 3,
  "topic": "RDS failover behaviour",
  "difficulty": "medium",
  "multi": false,
  "question": "During an RDS Multi-AZ failover, an application continued attempting to connect to the old primary for several minutes. What is the most likely cause?",
  "choices": {
   "A": "The application or its JVM is caching the DNS resolution of the database endpoint beyond the record TTL, so it does not pick up the address of the promoted standby.",
   "B": "Multi-AZ failover requires the application to be restarted because the endpoint hostname changes on failover.",
   "C": "The standby was in a different Region, so cross-Region promotion takes several minutes.",
   "D": "The security group attached to the standby had not yet been updated to allow the application subnet."
  },
  "answer": [
   "A"
  ],
  "explanation": "RDS Multi-AZ keeps the same endpoint hostname and repoints its DNS record at the promoted standby, so clients that honour the record's short TTL reconnect quickly. Applications or runtimes that cache DNS indefinitely — the JVM's default security setting is the classic case — keep the stale address and fail until the cache is cleared, which matches the several-minute delay described. Option B is wrong because the endpoint name does not change, which is the point of the design. Option C confuses Multi-AZ, which is within one Region, with cross-Region replication. Option D would produce a connection failure from the start rather than connections aimed at the old address, and both instances share the same security group configuration."
 },
 {
  "id": "dop-123",
  "source": "authored",
  "domain": 3,
  "topic": "Graceful degradation",
  "difficulty": "medium",
  "multi": false,
  "question": "An e-commerce checkout depends on a recommendations service that is not essential to completing a purchase. When recommendations are slow, checkout requests time out. Which design change is most appropriate?",
  "choices": {
   "A": "Treat the recommendations call as optional with a short timeout and a fallback to cached or empty results, so checkout completes even when the dependency is unavailable.",
   "B": "Increase the checkout request timeout so slow recommendation responses have time to arrive.",
   "C": "Scale the recommendations service so it is never slow.",
   "D": "Move the recommendations call into a synchronous retry loop with three attempts."
  },
  "answer": [
   "A"
  ],
  "explanation": "The correct response to a non-critical dependency is to make its failure non-critical in code: bound the call with a short timeout, catch failures, and degrade to a cached or empty result so the essential transaction still completes. That converts a hard dependency into a soft one. Option B extends how long customers wait before failing and holds server resources longer. Option C attempts to make a dependency perfectly reliable, which is not achievable and leaves checkout coupled to it regardless. Option D triples the time spent on an optional feature and adds load to a struggling service."
 },
 {
  "id": "dop-124",
  "source": "authored",
  "domain": 3,
  "topic": "S3 replication objectives",
  "difficulty": "medium",
  "multi": false,
  "question": "A compliance requirement states that 99.99% of objects uploaded to a bucket must be replicated to a second Region within 15 minutes, and that replication performance must be measurable. Which configuration meets this?",
  "choices": {
   "A": "S3 Cross-Region Replication with S3 Replication Time Control enabled, which carries a replication service level agreement and publishes replication metrics and events.",
   "B": "S3 Cross-Region Replication with versioning enabled and a CloudWatch alarm on the bucket size metric.",
   "C": "S3 Same-Region Replication with a lifecycle rule transitioning objects to another Region.",
   "D": "An S3 batch replication job scheduled to run every 15 minutes."
  },
  "answer": [
   "A"
  ],
  "explanation": "Replication Time Control is the feature that attaches a time commitment to Cross-Region Replication — most objects in seconds and 99.99% within 15 minutes — and it enables replication metrics and events such as pending bytes and operations missing the threshold, which supplies the measurability the requirement asks for. Option B replicates but offers no time commitment, and bucket size is not a replication latency signal. Option C misstates Same-Region Replication, which by definition stays in one Region, and lifecycle rules change storage class rather than location. Option D describes batch replication, which exists to backfill existing objects on demand rather than to provide continuous low-latency replication."
 },
 {
  "id": "dop-125",
  "source": "authored",
  "domain": 3,
  "topic": "Predictive scaling",
  "difficulty": "medium",
  "multi": false,
  "question": "A workload has a strong daily and weekly demand cycle with sharp morning ramps. Target tracking alone leaves the fleet undersized for the first fifteen minutes each morning. What should be added?",
  "choices": {
   "A": "Predictive scaling on the Auto Scaling group, which forecasts demand from historical CloudWatch data and provisions capacity ahead of the forecast ramp, used together with target tracking for real-time correction.",
   "B": "A step scaling policy with more aggressive steps at high utilisation.",
   "C": "A lower target value on the existing target tracking policy so the fleet always runs with more headroom.",
   "D": "A scheduled action for every morning at a fixed capacity value, reviewed manually each quarter."
  },
  "answer": [
   "A"
  ],
  "explanation": "Predictive scaling analyses at least a day of historical metric data, forecasts the coming cycle, and adds capacity before the ramp rather than in response to it, which addresses the structural lag of reactive scaling. AWS guidance is to run it alongside target tracking so unexpected demand is still handled reactively. Option B still reacts after utilisation rises, so the initial shortfall remains. Option C pays for permanent headroom all day and night to cover fifteen minutes. Option D can work but hardcodes a capacity number that drifts as traffic grows and requires the manual quarterly review the automation should replace."
 },
 {
  "id": "dop-126",
  "source": "authored",
  "domain": 3,
  "topic": "Kubernetes resilience",
  "difficulty": "hard",
  "multi": true,
  "question": "An Amazon EKS workload lost all replicas of a critical service during a node group upgrade. Which TWO Kubernetes-level configurations would have preserved availability?",
  "choices": {
   "A": "A PodDisruptionBudget specifying a minimum number of available replicas, so voluntary evictions during node drain cannot take the service below that threshold.",
   "B": "Pod topology spread constraints or anti-affinity rules that distribute replicas across nodes and Availability Zones rather than co-locating them.",
   "C": "A higher terminationGracePeriodSeconds on the pods so they take longer to shut down.",
   "D": "A HorizontalPodAutoscaler targeting CPU utilisation of 50%.",
   "E": "A larger node instance type so all replicas fit on a single node."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Node drains during an upgrade are voluntary disruptions, and a PodDisruptionBudget is precisely the mechanism that makes the eviction API refuse to take a service below a minimum availability, forcing the upgrade to proceed more slowly instead. Spreading replicas across nodes and zones with topology spread constraints or anti-affinity ensures that draining one node cannot remove every replica in the first place. Option C gives each pod longer to exit but does not stop them all being evicted together. Option D scales on load and has no view of disruptions. Option E is the opposite of what is needed, since concentrating all replicas on one node guarantees that draining it removes the service."
 },
 {
  "id": "dop-127",
  "source": "authored",
  "domain": 3,
  "topic": "Cross-Region DR automation",
  "difficulty": "hard",
  "multi": false,
  "question": "A team must be able to recreate their entire production environment in a second Region within one hour, and must prove quarterly that the procedure works. Which approach best supports both requirements?",
  "choices": {
   "A": "Define the environment entirely as infrastructure as code deployable to either Region with Region-specific parameters, and run a scheduled game day that deploys and validates the standby Region, tearing it down afterwards.",
   "B": "Document the recovery runbook in a wiki and have an engineer walk through it quarterly without deploying anything.",
   "C": "Take AMI and database snapshots in the primary Region and copy them to the second Region nightly.",
   "D": "Enable cross-Region replication on all S3 buckets and rely on the application team to rebuild compute when needed."
  },
  "answer": [
   "A"
  ],
  "explanation": "Recreating an environment reliably within an hour requires the definition to be executable rather than descriptive, and parameterised templates deployed by a pipeline give that. Actually deploying and validating the standby on a schedule is what turns an untested plan into a proven one, and tearing it down again keeps the cost of the exercise low. Option B is a tabletop exercise that never exercises the real automation, so drift goes undetected. Option C provides the data but leaves the environment build as unspecified manual work. Option D covers object storage only and explicitly leaves the compute recovery undefined and unpractised."
 },
 {
  "id": "dop-128",
  "source": "authored",
  "domain": 3,
  "topic": "Blast radius reduction",
  "difficulty": "hard",
  "multi": false,
  "question": "A single large multi-tenant service means any bad deployment or poison request affects all customers at once. The team wants to limit how many customers a single failure can affect. Which architectural approach addresses this?",
  "choices": {
   "A": "A cell-based architecture, partitioning customers across independent, identically deployed cells with a thin routing layer, so a failure or bad deployment is contained within one cell.",
   "B": "Increasing the number of instances in the service so load is spread more thinly.",
   "C": "Adding a second Availability Zone to the existing deployment.",
   "D": "Introducing a caching layer so fewer requests reach the service."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cell-based architecture is the standard answer to blast radius: customers are sharded into independent cells that do not share state or deployment fate, so a poison request or a bad release affects only the cell it lands in, and deployments can proceed cell by cell with observation between them. Option B changes capacity but every instance still serves every customer and receives every deployment. Option C protects against an Availability Zone failure, which is a different failure mode from a bad deployment or poison request. Option D reduces load and may mask some failures, but a bad deployment still reaches all customers simultaneously."
 },
 {
  "id": "dop-129",
  "source": "authored",
  "domain": 3,
  "topic": "Global Accelerator",
  "difficulty": "medium",
  "multi": false,
  "question": "A TCP-based game backend runs in two Regions. Clients hold long-lived connections, and DNS caching on client devices has made Route 53 failover unreliable. The team needs fast, deterministic failover using fixed IP addresses. Which service fits?",
  "choices": {
   "A": "AWS Global Accelerator, which provides static anycast IP addresses and shifts traffic between Regional endpoint groups based on health checks, without relying on client DNS behaviour.",
   "B": "Amazon CloudFront with an origin group, which caches responses at the edge and fails over between origins.",
   "C": "Amazon Route 53 with a lower record TTL and a failover routing policy.",
   "D": "An Application Load Balancer with targets registered in both Regions."
  },
  "answer": [
   "A"
  ],
  "explanation": "Global Accelerator gives two static anycast IP addresses that clients connect to and never need to re-resolve; traffic enters the AWS network at the nearest edge and is directed to healthy Regional endpoint groups, so failover happens in the network rather than through DNS. That removes the client caching problem and suits long-lived TCP connections. Option B is optimised for HTTP caching and is not a good fit for arbitrary TCP game traffic. Option C reduces but never eliminates DNS caching, which is exactly what has proven unreliable. Option D is not possible, since an ALB cannot register targets in another Region."
 },
 {
  "id": "dop-130",
  "source": "authored",
  "domain": 3,
  "topic": "SQS FIFO trade-offs",
  "difficulty": "medium",
  "multi": false,
  "question": "A payment system requires that events for a given account are processed in order, but overall throughput must remain high across millions of accounts. How should the queue be configured?",
  "choices": {
   "A": "Use an SQS FIFO queue with the account identifier as the message group ID, so ordering is guaranteed within each account while different groups are processed in parallel.",
   "B": "Use an SQS FIFO queue with a single constant message group ID to guarantee strict global ordering.",
   "C": "Use an SQS standard queue and sort messages by timestamp in the consumer before processing.",
   "D": "Use an SQS standard queue with a visibility timeout long enough that messages cannot overlap."
  },
  "answer": [
   "A"
  ],
  "explanation": "FIFO queues guarantee ordering within a message group, and different message groups are delivered and processed concurrently, so using the account identifier as the group ID gives per-account ordering with parallelism proportional to the number of active accounts. Option B is the classic mistake: one group serialises the entire queue, capping throughput at a single consumer's rate. Option C cannot work, because a standard queue does not deliver all related messages to one consumer at one time, so there is no complete set to sort. Option D controls redelivery timing and has no bearing on ordering."
 },
 {
  "id": "dop-131",
  "source": "authored",
  "domain": 3,
  "topic": "Asynchronous Lambda failures",
  "difficulty": "medium",
  "multi": false,
  "question": "A Lambda function invoked asynchronously by S3 event notifications occasionally fails. The team needs both failed and successful invocation results routed to different destinations for downstream handling, with the failure payload including the error details. What should be configured?",
  "choices": {
   "A": "Lambda destinations on the function's asynchronous invocation configuration, with an on-failure destination and an on-success destination such as SQS, SNS, EventBridge or another function.",
   "B": "A dead-letter queue on the function, which captures both successful and failed invocation records.",
   "C": "An SQS queue between S3 and Lambda, with the queue's redrive policy handling failures.",
   "D": "X-Ray tracing enabled on the function so failures are recorded with their payloads."
  },
  "answer": [
   "A"
  ],
  "explanation": "Lambda destinations extend the older dead-letter queue mechanism: an asynchronous invocation configuration can nominate separate on-success and on-failure destinations, and the record delivered includes the request payload, the response or error, and context about the invocation. That covers both halves of the requirement. Option B is wrong on the key detail, since a dead-letter queue receives only failed events and carries the payload without the error context. Option C changes the invocation model to a poll-based one, which alters ordering and concurrency behaviour and still provides no success destination. Option D produces traces for observability but does not route payloads to a destination for processing."
 },
 {
  "id": "dop-132",
  "source": "authored",
  "domain": 3,
  "topic": "EBS snapshot lifecycle",
  "difficulty": "easy",
  "multi": false,
  "question": "A team must snapshot several hundred EBS volumes every six hours, retain the snapshots for 14 days, and copy them to a second Region, without running any scheduling infrastructure. What should they use?",
  "choices": {
   "A": "Amazon Data Lifecycle Manager, with a snapshot lifecycle policy targeting volumes by tag, a six-hour schedule, a 14-day retention rule and cross-Region copy enabled.",
   "B": "A CloudWatch Events rule invoking a Lambda function that iterates volumes and calls CreateSnapshot.",
   "C": "A cron job on a management EC2 instance running the AWS CLI.",
   "D": "An AWS Config rule that creates a snapshot whenever a volume changes."
  },
  "answer": [
   "A"
  ],
  "explanation": "Data Lifecycle Manager is the managed answer for EBS snapshot automation: policies select volumes by tag, define schedules and retention counts or ages, and support cross-Region copy rules with their own retention — no functions, schedules or servers to own. Options B and C both reimplement it, and each brings error handling, throttling, pagination and permissions to maintain, with the EC2 approach adding a server to patch and a single point of failure. Option D misuses AWS Config, which evaluates configuration compliance and is not a backup scheduler; changes to a volume are also unrelated to a six-hour cadence."
 },
 {
  "id": "dop-133",
  "source": "authored",
  "domain": 3,
  "topic": "NAT gateway availability",
  "difficulty": "medium",
  "multi": false,
  "question": "A VPC spans three Availability Zones but has one NAT gateway in a single zone, used by private subnets in all three. What is the availability consequence and the correct design?",
  "choices": {
   "A": "Losing that Availability Zone removes outbound internet access for every private subnet; deploy one NAT gateway per zone and point each zone's private route table at the gateway in its own zone.",
   "B": "There is no availability consequence, because NAT gateways are Regional services that are automatically redundant across zones.",
   "C": "Losing that zone only affects instances in the same zone; add a second NAT gateway in any other zone as a backup route.",
   "D": "Replace the NAT gateway with a NAT instance in an Auto Scaling group of size one so it is recreated automatically."
  },
  "answer": [
   "A"
  ],
  "explanation": "A NAT gateway is a zonal resource. It is redundant within its own Availability Zone but does not survive the loss of that zone, so routing all private subnets through one creates a cross-zone dependency in which a single zone failure removes outbound connectivity everywhere. The recommended design is a NAT gateway per zone with each zone's private route table using its local gateway, which also avoids cross-zone data charges. Option B states the opposite of how the resource works. Option C is partly right about adding a second gateway but wrong about the impact, and VPC route tables do not fail over between targets. Option D reintroduces a self-managed component with worse throughput and a recovery time measured in minutes."
 },
 {
  "id": "dop-134",
  "source": "authored",
  "domain": 3,
  "topic": "Measuring recovery objectives",
  "difficulty": "medium",
  "multi": false,
  "question": "A team claims an RPO of five minutes based on their database replication configuration. Which activity best validates that claim?",
  "choices": {
   "A": "Run a recovery exercise that fails over to the standby, then compare the last committed transaction there against the primary to measure actual data loss, and monitor replication lag continuously between exercises.",
   "B": "Confirm the replication setting is enabled in the console and document the vendor's stated replication interval.",
   "C": "Restore the most recent automated backup into a test environment and confirm it opens successfully.",
   "D": "Review CloudTrail logs to confirm no configuration changes have been made to the replication settings."
  },
  "answer": [
   "A"
  ],
  "explanation": "An RPO is a claim about how much data would actually be lost in a real recovery, so validating it requires performing the recovery and measuring the gap, backed by continuous replication lag monitoring so regressions are visible between exercises. Option B verifies intent rather than outcome, and configured settings routinely diverge from real behaviour under load. Option C validates backup integrity, which speaks to a backup-based RPO measured in hours rather than the replication-based claim. Option D confirms nothing changed but says nothing about whether the objective was ever achievable."
 },
 {
  "id": "dop-135",
  "source": "authored",
  "domain": 3,
  "topic": "Caching layer resilience",
  "difficulty": "hard",
  "multi": false,
  "question": "An application uses Amazon ElastiCache for Redis in front of a database. When the cache node was replaced, the database was overwhelmed by the sudden surge of uncached reads. Which TWO-part change best prevents a recurrence?",
  "choices": {
   "A": "Enable Multi-AZ with automatic failover on a replication group so node loss does not empty the cache, and add request coalescing or a limited concurrency guard so a cache miss storm cannot be passed through to the database unbounded.",
   "B": "Increase the cache node size so it holds more data and is less likely to be replaced.",
   "C": "Disable the cache during maintenance windows so the database is always warm.",
   "D": "Set a longer TTL on cached items so entries survive node replacement."
  },
  "answer": [
   "A"
  ],
  "explanation": "Two things went wrong: the cache lost its data entirely on node replacement, and the resulting miss storm reached the database without limit. A Multi-AZ replication group with automatic failover promotes a replica that already holds the working set, so the cache is not cold after a node loss, and coalescing concurrent identical misses or bounding database concurrency ensures that even a genuine cold start degrades latency rather than collapsing the database. Option B changes capacity but a single node still loses everything when replaced. Option C moves the surge to a scheduled time rather than preventing it, and runs the database at full load routinely. Option D is ineffective because TTLs govern expiry of entries in a live cache and do not persist anything through the loss of the node holding them."
 },
 {
  "id": "dop-136",
  "source": "authored",
  "domain": 4,
  "topic": "Centralised logging architecture",
  "difficulty": "medium",
  "multi": false,
  "question": "An organisation with 60 accounts wants application logs from all accounts searchable in one place, with a retention period of 90 days for search and cheaper long-term archival for two years. Which architecture is most appropriate?",
  "choices": {
   "A": "Ship logs from each account to a central account with CloudWatch Logs subscription filters into Amazon Data Firehose, which delivers to Amazon OpenSearch Service for search and to Amazon S3 with lifecycle rules for archival.",
   "B": "Grant every engineer cross-account read access to each account's CloudWatch Logs so they can search each account individually.",
   "C": "Increase the CloudWatch Logs retention period to two years in every account and use Logs Insights across log groups.",
   "D": "Export logs from each account to S3 once a day with a create-export-task call and query them with Amazon Athena."
  },
  "answer": [
   "A"
  ],
  "explanation": "Subscription filters stream log events out of CloudWatch Logs in near real time, and Firehose can fan the same stream to both a search destination and S3, which cleanly separates the 90-day searchable tier from cheap long-term storage governed by lifecycle rules. Cross-account delivery to a central destination is a supported pattern at this scale. Option B leaves logs scattered and makes any cross-account investigation a manual sweep of 60 accounts. Option C keeps everything in the most expensive tier for two years and Logs Insights cannot query across accounts without additional configuration. Option D is workable for archival but the daily export leaves a long delay before recent logs are queryable, which is poor for incident response."
 },
 {
  "id": "dop-137",
  "source": "authored",
  "domain": 4,
  "topic": "CloudWatch metric filters",
  "difficulty": "medium",
  "multi": false,
  "question": "An application writes a line containing the token OutOfMemoryError to its log group. The team wants an alarm when this happens more than twice in five minutes. What should be configured?",
  "choices": {
   "A": "A CloudWatch Logs metric filter matching the token, publishing a custom metric, with a CloudWatch alarm on that metric using a sum statistic over five minutes and a threshold of two.",
   "B": "A CloudWatch Logs Insights query scheduled every five minutes with an alarm on the query results.",
   "C": "A CloudWatch alarm directly on the log group with a pattern condition.",
   "D": "A subscription filter delivering matching events to a Lambda function that sends an email on each occurrence."
  },
  "answer": [
   "A"
  ],
  "explanation": "Metric filters are the mechanism that turns log content into a metric: the filter pattern matches the token, each match increments a custom metric, and a standard alarm then evaluates the sum over a five-minute period against the threshold. Option B is not directly supported, since Logs Insights queries are not an alarm source without additional automation to publish results as a metric. Option C describes something CloudWatch does not offer — alarms evaluate metrics, not log groups. Option D notifies on every single occurrence, which does not implement the more-than-twice-in-five-minutes condition and produces noise."
 },
 {
  "id": "dop-138",
  "source": "authored",
  "domain": 4,
  "topic": "Composite alarms",
  "difficulty": "medium",
  "multi": false,
  "question": "An on-call rotation is being paged repeatedly during deployments because six separate alarms fire together for the same underlying cause. The team wants one actionable page while keeping the individual alarms for diagnosis. What should be configured?",
  "choices": {
   "A": "A CloudWatch composite alarm combining the child alarms with a rule expression, with notification actions moved to the composite alarm and removed from the children.",
   "B": "A longer evaluation period on each of the six alarms so they fire less often.",
   "C": "An SNS topic filter policy that drops duplicate messages within a time window.",
   "D": "A single alarm on a metric math expression that averages all six metrics into one value."
  },
  "answer": [
   "A"
  ],
  "explanation": "Composite alarms exist for exactly this: a rule expression references the child alarm states, the composite alarm carries the notification action, and the children remain in place with their own states for diagnosis but no longer page anyone. That reduces six pages to one without losing signal. Option B delays every alarm including genuine single failures. Option C is not something SNS filter policies do, since they route messages on attributes rather than deduplicating. Option D destroys the meaning of the individual signals, since averaging unrelated metrics produces a number that is hard to threshold and impossible to interpret."
 },
 {
  "id": "dop-139",
  "source": "authored",
  "domain": 4,
  "topic": "Structured logging and EMF",
  "difficulty": "hard",
  "multi": false,
  "question": "A Lambda function must publish high-cardinality custom metrics such as per-customer request counts without making a PutMetricData API call on every invocation. Which approach achieves this?",
  "choices": {
   "A": "Write logs in the CloudWatch embedded metric format, so CloudWatch extracts metric values from the structured log events asynchronously while the full-cardinality data remains queryable in the log group.",
   "B": "Batch PutMetricData calls in memory and flush them every hundred invocations.",
   "C": "Publish each value as a separate CloudWatch dimension on a single metric name.",
   "D": "Write the values to a DynamoDB table and build a dashboard from a scheduled query."
  },
  "answer": [
   "A"
  ],
  "explanation": "The embedded metric format lets a function emit a structured JSON log event that carries both metric values and arbitrary properties; CloudWatch parses those events and creates metrics automatically, so there is no synchronous API call in the invocation path, and the high-cardinality fields stay searchable in the log group even though they are not all promoted to metric dimensions. Option B still calls the API and, in Lambda, in-memory batches are lost when an execution environment is recycled. Option C is the trap — every unique dimension value creates a separate metric, so high cardinality becomes expensive very quickly. Option D builds a parallel metrics system with its own storage and query cost."
 },
 {
  "id": "dop-140",
  "source": "authored",
  "domain": 4,
  "topic": "Cross-account observability",
  "difficulty": "medium",
  "multi": false,
  "question": "Engineers need to view metrics, logs and traces from twelve workload accounts in a single CloudWatch console without switching roles. Which feature provides this?",
  "choices": {
   "A": "CloudWatch cross-account observability, linking the workload accounts as source accounts to a central monitoring account so its console shows their metrics, logs and X-Ray traces.",
   "B": "A CloudWatch dashboard in the monitoring account with the account ID specified on each widget.",
   "C": "Metric streams from each account into a central Amazon Data Firehose delivery stream.",
   "D": "An organisation trail delivering CloudTrail events to a central bucket."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudWatch cross-account observability establishes a monitoring account and links source accounts, after which the monitoring account's console surfaces metrics, log groups and traces from all linked accounts in one place, including cross-account Logs Insights queries and service maps. Option B works for individual metric widgets through cross-account sharing but does not bring logs or traces into the console, so it only satisfies part of the requirement. Option C moves metric data into a stream for external systems and does not populate the CloudWatch console. Option D centralises API audit events, which are neither metrics nor application logs nor traces."
 },
 {
  "id": "dop-141",
  "source": "authored",
  "domain": 4,
  "topic": "Distributed tracing",
  "difficulty": "medium",
  "multi": false,
  "question": "A request passes through API Gateway, a Lambda function, an SQS queue and a second Lambda function that writes to DynamoDB. Latency has increased and the team cannot tell which hop is responsible. Which approach identifies the slow segment fastest?",
  "choices": {
   "A": "Enable AWS X-Ray tracing across the services and inspect the service map and trace segment timings to locate the hop contributing the added latency.",
   "B": "Enable detailed CloudWatch monitoring on each service and compare the average latency metrics on a dashboard.",
   "C": "Add log statements with timestamps at the start and end of each function and correlate them manually by request ID.",
   "D": "Enable VPC Flow Logs on the subnets hosting the Lambda functions to measure network latency."
  },
  "answer": [
   "A"
  ],
  "explanation": "X-Ray propagates a trace ID across the supported services and records timed segments and subsegments per request, so the service map and individual traces show directly where the time is spent, including downstream calls to DynamoDB. That is the purpose-built answer for latency attribution across hops. Option B gives per-service averages that hide per-request variation and cannot attribute a single slow request to a hop. Option C is the manual version of tracing and is laborious and error prone across four components. Option D captures network flow metadata such as bytes and acceptance, not application latency, and says nothing about time spent in DynamoDB or the queue."
 },
 {
  "id": "dop-142",
  "source": "authored",
  "domain": 4,
  "topic": "Log retention and cost",
  "difficulty": "easy",
  "multi": false,
  "question": "CloudWatch Logs costs have grown steadily because log groups created by new applications default to never expire. What is the most effective control?",
  "choices": {
   "A": "Set an explicit retention period on log groups, enforced going forward with an AWS Config rule or an EventBridge rule that applies a default retention when a log group is created.",
   "B": "Periodically delete the largest log groups to reclaim space.",
   "C": "Reduce the log level of all applications to error only.",
   "D": "Export all log groups to S3 daily and delete the CloudWatch copies manually."
  },
  "answer": [
   "A"
  ],
  "explanation": "Log groups retain events indefinitely unless a retention period is set, so the durable fix is to set retention and to enforce it automatically on newly created groups, either detectively with a Config rule and remediation or reactively with an EventBridge rule on the CreateLogGroup event that calls PutRetentionPolicy. Option B deletes data that may still be needed and does not stop the pattern recurring. Option C reduces volume but discards diagnostic information that is often exactly what is needed during an incident, and it does not address unbounded retention. Option D is a manual routine that will be forgotten, and the export itself costs money while the underlying default remains wrong."
 },
 {
  "id": "dop-143",
  "source": "authored",
  "domain": 4,
  "topic": "Synthetic monitoring",
  "difficulty": "medium",
  "multi": false,
  "question": "A checkout flow occasionally breaks in a way that health checks do not detect, because each individual service reports healthy while the multi-step user journey fails. The team wants continuous detection from outside the application. What should they implement?",
  "choices": {
   "A": "A CloudWatch Synthetics canary that scripts the full multi-step checkout journey, runs on a schedule from outside the application, and alarms on failed steps with screenshots and HAR files for diagnosis.",
   "B": "A CloudWatch alarm on the Application Load Balancer HealthyHostCount metric for the checkout service.",
   "C": "CloudWatch RUM, which collects performance data from real user sessions in the browser.",
   "D": "A composite alarm combining the health of each service involved in checkout."
  },
  "answer": [
   "A"
  ],
  "explanation": "Canaries are scripted, continuously executed synthetic transactions that exercise a user journey end to end from outside the system, so they catch exactly the failures that per-service health checks miss, and they capture screenshots, HAR files and step timings for diagnosis. Option B reports how many targets are registered and healthy, which is precisely the signal that stays green during this failure. Option C is genuinely useful and would show real users encountering the problem, but it is passive and depends on users hitting the broken path, so detection is neither continuous nor proactive. Option D combines the same misleadingly healthy signals."
 },
 {
  "id": "dop-144",
  "source": "authored",
  "domain": 4,
  "topic": "Organisation CloudTrail",
  "difficulty": "medium",
  "multi": true,
  "question": "A security team must capture management events from every account in an AWS Organization into a central, tamper-evident store, including accounts added in the future. Which TWO configurations achieve this?",
  "choices": {
   "A": "Create an organization trail in the management account or a delegated administrator account, which automatically applies to all member accounts including new ones.",
   "B": "Enable log file integrity validation on the trail so digest files allow detection of modified or deleted log files.",
   "C": "Create an individual trail in each member account and configure each to write to the central bucket, adding new accounts as they are created.",
   "D": "Enable S3 server access logging on the central bucket so all reads and writes are recorded.",
   "E": "Enable CloudTrail Insights on the trail so unusual API activity is flagged."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "An organization trail is created once and applied across every account in the organisation, with member accounts added automatically as they join, which satisfies the coverage requirement without per-account work. Log file integrity validation produces signed digest files that make any modification or deletion of delivered logs detectable, which is the tamper-evidence requirement. Option C achieves the same coverage today but requires ongoing per-account work as accounts are added, which the requirement excludes. Option D records access to the bucket rather than protecting the integrity of the log files. Option E adds anomaly detection on API call volume, which is valuable but neither coverage nor tamper evidence."
 },
 {
  "id": "dop-145",
  "source": "authored",
  "domain": 4,
  "topic": "CloudTrail data events",
  "difficulty": "medium",
  "multi": false,
  "question": "An investigation needs to determine which principal read a specific object from an S3 bucket. The account has a CloudTrail trail enabled with default settings, but the GetObject call does not appear. Why, and what should be changed?",
  "choices": {
   "A": "Object-level operations are data events, which are not logged by default; enable S3 data events for the bucket on a trail, accepting the additional cost and volume.",
   "B": "The trail is not multi-Region, so the call was logged in another Region; enable a multi-Region trail.",
   "C": "CloudTrail does not log S3 object access at all; enable S3 server access logging instead.",
   "D": "The trail has log file validation disabled, so read events are suppressed; enable validation."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudTrail distinguishes management events, which cover control plane operations and are logged by default, from data events such as S3 GetObject and PutObject and Lambda Invoke, which are high volume and must be explicitly enabled per trail with a resource selector. Enabling S3 data events for the bucket makes those calls appear, with cost proportional to request volume. Option B addresses a real gap in single-Region trails but S3 object access is missing here because of the event category, not the Region. Option C is wrong: CloudTrail data events do cover object access, and server access logging is a separate, best-effort alternative with less identity detail. Option D confuses integrity validation with event selection."
 },
 {
  "id": "dop-146",
  "source": "authored",
  "domain": 4,
  "topic": "CloudWatch agent",
  "difficulty": "medium",
  "multi": false,
  "question": "A team needs memory utilisation and disk space metrics from EC2 instances, but only CPU, network and disk I/O appear in CloudWatch. What is required?",
  "choices": {
   "A": "Install and configure the CloudWatch agent on the instances with a configuration collecting mem and disk metrics, and grant the instance role permission to publish them.",
   "B": "Enable detailed monitoring on the instances so metrics are published at one-minute resolution including memory.",
   "C": "Enable EC2 instance metadata v2 so the hypervisor can report guest memory usage.",
   "D": "Create a CloudWatch metric math expression that derives memory usage from CPU and network metrics."
  },
  "answer": [
   "A"
  ],
  "explanation": "The metrics EC2 publishes without an agent are those the hypervisor can observe from outside the instance, which excludes anything inside the guest operating system such as memory and filesystem usage. Collecting those requires the CloudWatch agent, a configuration file naming the metrics, and permission on the instance role to call PutMetricData. Option B changes the publishing frequency of the existing metrics from five minutes to one minute and adds no new metric types. Option C concerns how instance metadata is retrieved and has no relationship to guest metrics. Option D is not possible, since memory usage cannot be derived from unrelated metrics."
 },
 {
  "id": "dop-147",
  "source": "authored",
  "domain": 4,
  "topic": "Alarms on missing data",
  "difficulty": "hard",
  "multi": false,
  "question": "An alarm monitors a metric that is only published when the application processes a request. When the application stopped entirely and published nothing, the alarm stayed in the OK state and nobody was notified. What should be changed?",
  "choices": {
   "A": "Set the alarm's treat missing data setting to breaching, so an absence of data points moves the alarm into ALARM rather than leaving it in its previous state.",
   "B": "Reduce the alarm evaluation period so missing data is noticed sooner.",
   "C": "Set the treat missing data setting to ignore, so the alarm maintains its current state until data returns.",
   "D": "Add a second alarm on the same metric with a lower threshold."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudWatch alarms have an explicit policy for periods with no data points, and the default of missing means those periods do not change the alarm state, which is why a completely stopped application leaves the alarm sitting in OK. Treating missing data as breaching makes the absence of the metric itself the failure signal, which is the correct semantic for a heartbeat-style metric. Option B changes how quickly evaluation happens but not how missing periods are interpreted. Option C is the opposite of what is needed and explicitly preserves the misleading OK state. Option D adds another alarm evaluating the same absent data with the same default behaviour."
 },
 {
  "id": "dop-148",
  "source": "authored",
  "domain": 4,
  "topic": "Percentile statistics",
  "difficulty": "medium",
  "multi": false,
  "question": "Average API latency looks healthy at 120 ms, but customers report frequent slow requests. Which monitoring change best surfaces the problem?",
  "choices": {
   "A": "Alarm on a high percentile such as p99 latency rather than the average, since averages hide the tail of the distribution where the slow requests live.",
   "B": "Alarm on the maximum latency statistic so the single slowest request is always visible.",
   "C": "Reduce the metric period from five minutes to one minute while keeping the average statistic.",
   "D": "Add a dimension for the Availability Zone and continue alarming on the average."
  },
  "answer": [
   "A"
  ],
  "explanation": "An average compresses the whole distribution into one number, so a small fraction of very slow requests barely moves it — which is exactly the reported symptom. Percentile statistics such as p99 describe the experience of the worst-served requests and are the standard basis for latency objectives and alarms. Option B is too sensitive, since a single outlier will trigger it constantly and it carries no information about how many customers are affected. Option C samples the same misleading statistic more often. Option D may be useful for locating a problem once detected, but averaging within each zone still hides the tail."
 },
 {
  "id": "dop-149",
  "source": "authored",
  "domain": 4,
  "topic": "Container observability",
  "difficulty": "medium",
  "multi": false,
  "question": "A team running Amazon EKS wants per-pod and per-node CPU, memory and network metrics, plus container logs, in CloudWatch without instrumenting each application. What should they deploy?",
  "choices": {
   "A": "CloudWatch Container Insights, deploying the CloudWatch agent and Fluent Bit as a DaemonSet to collect performance metrics and container logs from every node.",
   "B": "The AWS Distro for OpenTelemetry collector configured to scrape only application-provided metric endpoints.",
   "C": "CloudWatch Lambda Insights, which provides the same telemetry for containerised workloads.",
   "D": "AWS X-Ray daemon deployed as a sidecar in each pod."
  },
  "answer": [
   "A"
  ],
  "explanation": "Container Insights collects cluster, node, pod and container level performance metrics along with container logs, using the CloudWatch agent and Fluent Bit run as DaemonSets, so no application changes are required. That matches both halves of the requirement. Option B collects only what the applications already expose, which is precisely the instrumentation the team wants to avoid. Option C names a real feature but Lambda Insights is specific to Lambda functions and does not apply to EKS. Option D provides distributed traces rather than resource metrics or logs, and still requires application instrumentation to be useful."
 },
 {
  "id": "dop-150",
  "source": "authored",
  "domain": 4,
  "topic": "Anomaly detection",
  "difficulty": "medium",
  "multi": false,
  "question": "A metric with strong daily and weekly seasonality cannot be alarmed on a static threshold: a value that is normal at midday is a serious problem at 3 a.m. Which CloudWatch capability addresses this?",
  "choices": {
   "A": "CloudWatch anomaly detection, which builds a model of the metric's expected range from historical data and drives an alarm on deviation from the expected band.",
   "B": "A metric math expression comparing the current value with the same period one week earlier.",
   "C": "A composite alarm combining separate daytime and night-time alarms.",
   "D": "High-resolution metrics with a one-second period to catch changes faster."
  },
  "answer": [
   "A"
  ],
  "explanation": "Anomaly detection trains a model on the metric's history, learns its daily and weekly patterns, and produces an expected band; an anomaly detection alarm fires when values fall outside that band, so the effective threshold moves with the seasonality automatically. Option B is a reasonable manual approximation but it is brittle around holidays and growth trends and requires maintaining the expression. Option C encodes the seasonality as hardcoded time windows, which must be maintained and cannot express weekly patterns cleanly. Option D increases resolution without solving the threshold problem at all."
 },
 {
  "id": "dop-151",
  "source": "authored",
  "domain": 4,
  "topic": "Log analysis at scale",
  "difficulty": "medium",
  "multi": false,
  "question": "Two years of application logs are archived in Amazon S3 in compressed JSON. An auditor needs an ad hoc query across the whole archive a few times per year. Which approach is most cost-effective?",
  "choices": {
   "A": "Define a table over the S3 prefix in the AWS Glue Data Catalog with partition projection by date, and query it with Amazon Athena, which charges per data scanned.",
   "B": "Load the entire archive into Amazon OpenSearch Service so the auditor can search it interactively.",
   "C": "Load the archive into Amazon Redshift and grant the auditor query access.",
   "D": "Re-ingest the archive into CloudWatch Logs and use Logs Insights."
  },
  "answer": [
   "A"
  ],
  "explanation": "Athena queries data in place in S3 with no cluster to run, charging only for bytes scanned, which suits an archive queried a handful of times per year; partitioning by date, and projecting those partitions, keeps each query scanning only the relevant days. Option B provisions and pays for a cluster continuously to serve occasional queries, and indexing two years of logs is expensive. Option C likewise runs a warehouse permanently and requires a loading pipeline. Option D is the most expensive of all, since CloudWatch Logs ingestion and storage pricing is aimed at recent operational data rather than cold archives."
 },
 {
  "id": "dop-152",
  "source": "authored",
  "domain": 4,
  "topic": "VPC Flow Logs",
  "difficulty": "medium",
  "multi": false,
  "question": "A DevOps engineer must determine why traffic from an application subnet to a database subnet is failing, and specifically whether packets are being blocked by a security group or a network ACL. Which data source answers this?",
  "choices": {
   "A": "VPC Flow Logs, where a REJECT record indicates the traffic was denied; because security groups are stateful and network ACLs are not, the presence or absence of a corresponding return-path record helps distinguish the two.",
   "B": "CloudTrail management events for the EC2 service, which record every packet decision.",
   "C": "CloudWatch metrics for the network interfaces, which report dropped packet counts by rule.",
   "D": "Amazon Route 53 Resolver query logs, which record connection attempts by destination."
  },
  "answer": [
   "A"
  ],
  "explanation": "Flow Logs record accepted and rejected traffic per network interface with source, destination, ports and an action field, so a REJECT is direct evidence that a security group or network ACL denied the flow. Because security groups are stateful, return traffic for an allowed connection is implicitly permitted, whereas a stateless network ACL must permit both directions, so the pattern of records on each side helps identify which control is responsible. Option B is wrong because CloudTrail records API calls, not packet decisions. Option C misstates the available metrics, which do not attribute drops to specific rules. Option D captures DNS queries, not connection outcomes."
 },
 {
  "id": "dop-153",
  "source": "authored",
  "domain": 4,
  "topic": "Metric streams",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants near real-time delivery of all CloudWatch metrics into a third-party observability platform, without polling the CloudWatch API and running into throttling. What should be configured?",
  "choices": {
   "A": "A CloudWatch metric stream delivering to Amazon Data Firehose, which forwards metrics to the third-party endpoint in OpenTelemetry or JSON format.",
   "B": "A scheduled Lambda function calling GetMetricData across all namespaces every minute.",
   "C": "A CloudWatch dashboard shared publicly so the third-party tool can scrape it.",
   "D": "An EventBridge rule matching CloudWatch metric events and forwarding them to an HTTP endpoint."
  },
  "answer": [
   "A"
  ],
  "explanation": "Metric streams are the push-based export path for CloudWatch metrics: they continuously deliver metric updates to a Firehose delivery stream, which can transform and deliver to an HTTP endpoint, and they scale without the API rate limits and cost of repeated GetMetricData polling. Option B is the polling approach the requirement excludes, and it is expensive and throttling-prone at scale. Option C exposes data publicly and is not a supported ingestion mechanism. Option D does not exist as described, since CloudWatch does not emit an event to EventBridge for every metric data point — only alarm state changes are published."
 },
 {
  "id": "dop-154",
  "source": "authored",
  "domain": 4,
  "topic": "Dashboards and operational visibility",
  "difficulty": "easy",
  "multi": false,
  "question": "A team wants an operational dashboard defined alongside their infrastructure code so it is version-controlled and recreated automatically in every environment. What is the appropriate implementation?",
  "choices": {
   "A": "Define an AWS::CloudWatch::Dashboard resource in the CloudFormation template with the dashboard body as JSON, parameterised per environment.",
   "B": "Build the dashboard in the console and export a screenshot into the repository for reference.",
   "C": "Build the dashboard in the console in the production account and share the URL with the other environments.",
   "D": "Create a runbook instructing engineers to recreate the dashboard manually in each new environment."
  },
  "answer": [
   "A"
  ],
  "explanation": "Dashboards are ordinary CloudFormation resources whose body is a JSON document, so defining them in the template puts them under version control, makes them reviewable in pull requests and guarantees every environment gets the same dashboard with environment-specific resource names substituted through parameters. Option B stores an image, which cannot be deployed. Option C shows production data to every environment and gives no per-environment view. Option D is the manual process the requirement is trying to eliminate, and manual recreation guarantees divergence."
 },
 {
  "id": "dop-155",
  "source": "authored",
  "domain": 4,
  "topic": "Log encryption and access",
  "difficulty": "medium",
  "multi": false,
  "question": "Logs containing sensitive data must be encrypted in CloudWatch Logs with a key the security team controls, and access to decrypt must be revocable independently of CloudWatch Logs permissions. What should be configured?",
  "choices": {
   "A": "Associate a customer managed AWS KMS key with the log group, with a key policy granting the CloudWatch Logs service principal permission to use it and restricting decrypt permissions to approved principals.",
   "B": "Enable default encryption on CloudWatch Logs, which uses an AWS managed key that the security team can disable.",
   "C": "Write logs to an S3 bucket with SSE-KMS and stop using CloudWatch Logs entirely.",
   "D": "Apply an IAM policy denying logs:GetLogEvents to everyone except the security team."
  },
  "answer": [
   "A"
  ],
  "explanation": "Associating a customer managed key with a log group means every stored event is encrypted under a key whose policy the security team owns, so revoking or disabling the key removes the ability to read the data regardless of what CloudWatch Logs permissions a principal holds. That independent control is the distinguishing requirement. Option B describes the default AWS managed encryption, whose key cannot be managed or disabled by the customer. Option C changes the storage system rather than meeting the requirement in CloudWatch Logs, and loses live querying. Option D restricts access through IAM alone, which is a single control plane rather than the independent key-based revocation asked for."
 },
 {
  "id": "dop-156",
  "source": "authored",
  "domain": 4,
  "topic": "Alarm actions",
  "difficulty": "easy",
  "multi": false,
  "question": "An EC2 instance running a single-instance legacy application must be rebooted automatically when its system status check fails for two consecutive minutes. What is the simplest implementation?",
  "choices": {
   "A": "A CloudWatch alarm on the StatusCheckFailed_System metric for that instance with an EC2 action to recover the instance.",
   "B": "A Lambda function invoked by an EventBridge schedule every minute that polls the instance status and reboots it if needed.",
   "C": "An Auto Scaling group of size one with an ELB health check.",
   "D": "A Systems Manager State Manager association that reboots the instance daily."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudWatch alarms support EC2 actions, including recover, stop, terminate and reboot, applied directly to the instance the alarm monitors, so an alarm on the system status check metric with a recover action gives automated remediation with no code and no additional infrastructure. Option B reimplements a built-in feature with a function and a schedule to maintain. Option C is a reasonable resilience improvement in general, but replacing rather than recovering the instance loses instance store data and the local state a legacy single-instance application often depends on. Option D reboots on a clock regardless of health, which causes unnecessary outages and does not respond to the failure."
 },
 {
  "id": "dop-157",
  "source": "authored",
  "domain": 4,
  "topic": "Trace sampling",
  "difficulty": "hard",
  "multi": false,
  "question": "A high-throughput service instrumented with AWS X-Ray is generating trace costs far above budget, but the team must retain full visibility into errors and slow requests. What should they configure?",
  "choices": {
   "A": "A custom X-Ray sampling rule that samples a small percentage of normal requests while matching and retaining traces for error responses and requests to critical paths at a higher rate.",
   "B": "Disable X-Ray on the busiest services and rely on CloudWatch metrics there.",
   "C": "Reduce the X-Ray trace retention period so older traces are discarded sooner.",
   "D": "Enable X-Ray Insights so only anomalous traces are recorded."
  },
  "answer": [
   "A"
  ],
  "explanation": "X-Ray sampling rules control which requests are traced, using a reservoir of traces per second plus a fixed rate, and rules can match on service name, HTTP method, URL path and other attributes with a priority order. That allows normal traffic to be sampled sparsely while errors and critical endpoints are matched by a higher-rate rule, meeting both the cost and visibility requirements. Option B creates blind spots in exactly the services that matter most. Option C does not reduce ingestion cost, which is driven by traces recorded rather than retention. Option D misstates Insights, which analyses traces that were already sampled and does not act as a sampling filter."
 },
 {
  "id": "dop-158",
  "source": "authored",
  "domain": 4,
  "topic": "Service level objectives",
  "difficulty": "hard",
  "multi": false,
  "question": "A platform team wants to define an availability objective for an API, measure error budget consumption, and alert when the budget is being burned fast enough to breach the objective. Which approach reflects good practice?",
  "choices": {
   "A": "Define a service level indicator from request success rate, set an objective such as 99.9% over 30 days, compute the remaining error budget, and alert on burn rate over short and long windows rather than on every individual error.",
   "B": "Alert whenever any request returns a 5xx response, so no failure goes unnoticed.",
   "C": "Set the objective at 100% availability and alert on any deviation.",
   "D": "Measure availability from the load balancer HealthyHostCount metric and alert when it drops below the desired count."
  },
  "answer": [
   "A"
  ],
  "explanation": "The described practice is the standard error budget approach: an indicator measured from real request outcomes, an objective over a defined window, and multi-window burn rate alerts that fire when the budget is being consumed fast enough to matter while staying quiet for isolated errors. Option B pages on individual failures, which is noisy, unactionable at scale and unrelated to whether the objective is at risk. Option C sets an unattainable objective, leaving no error budget and guaranteeing constant alerting. Option D measures infrastructure health rather than the experience of requests, so a fully healthy fleet returning errors would look perfect."
 },
 {
  "id": "dop-159",
  "source": "authored",
  "domain": 4,
  "topic": "CloudTrail Lake",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team runs frequent SQL-style investigations across seven years of CloudTrail events and finds managing the S3 archive, Glue catalog and Athena partitions burdensome. Which option reduces that operational work?",
  "choices": {
   "A": "AWS CloudTrail Lake, which stores events in a managed event data store with a configurable retention of up to ten years and supports SQL queries directly without a separate catalog or partitioning.",
   "B": "CloudTrail Insights, which analyses API call volume for anomalies.",
   "C": "Amazon Security Lake, which normalises findings from security services into OCSF format.",
   "D": "An Amazon OpenSearch Service domain with UltraWarm storage for the older indices."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudTrail Lake is a managed audit data store: events are ingested directly, retention can be set for many years, and queries are written in SQL against the event data store, removing the S3 layout, Glue catalog and partition maintenance the team is struggling with. Option B detects unusual API activity and is not a query surface for historical investigation. Option C is a broader security data lake that centralises and normalises data from multiple sources, which is a larger and different undertaking than simplifying CloudTrail querying. Option D replaces one self-managed query stack with another that must be sized, patched and paid for continuously."
 },
 {
  "id": "dop-160",
  "source": "authored",
  "domain": 4,
  "topic": "Logs Insights",
  "difficulty": "medium",
  "multi": false,
  "question": "During an incident an engineer needs to find the ten slowest requests in the last hour from a JSON-formatted CloudWatch log group. Which capability gives the answer fastest?",
  "choices": {
   "A": "A CloudWatch Logs Insights query that parses the duration field, sorts descending and limits to ten results, run over the last hour.",
   "B": "A metric filter that publishes duration as a metric, then a dashboard widget showing the maximum.",
   "C": "Exporting the log group to S3 and querying it with Athena.",
   "D": "Filtering the log stream in the console with a text search on the word duration."
  },
  "answer": [
   "A"
  ],
  "explanation": "Logs Insights queries a log group interactively, automatically discovers fields in JSON events, and supports sort and limit, so the ten slowest requests with their full context are returned in seconds without any prior setup. Option B produces an aggregate maximum rather than the individual slow requests and their details, and metric filters only apply to events published after the filter is created. Option C works but the export takes time and the setup cost is inappropriate during an active incident. Option D returns matching lines in stream order with no ability to sort by value, so the engineer would have to read them all."
 },
 {
  "id": "dop-161",
  "source": "authored",
  "domain": 4,
  "topic": "Alarm state change automation",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants a ticket created automatically in their tracking system whenever any CloudWatch alarm in the account enters the ALARM state, without adding an SNS subscription to each alarm individually. What should they configure?",
  "choices": {
   "A": "An EventBridge rule matching the CloudWatch Alarm State Change event with a detail filter on the new state, targeting a function or API destination that creates the ticket.",
   "B": "An SNS topic subscribed by every alarm in the account, with a Lambda function subscriber creating tickets.",
   "C": "A CloudWatch composite alarm covering all alarms in the account with a ticket-creating action.",
   "D": "A scheduled Lambda function that calls DescribeAlarms every minute and creates tickets for alarms in the ALARM state."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudWatch publishes an alarm state change event to the default event bus for every alarm, so a single EventBridge rule with a pattern matching a new state of ALARM covers all current and future alarms and can target an API destination to call the ticketing system directly. Option B works but requires configuring an action on every alarm, including every new one, which is the per-alarm work the requirement excludes. Option C would need every alarm listed in the rule expression and composite alarms have a limit on children, so it does not generalise. Option D polls, adds latency, and must track which alarms it has already ticketed to avoid duplicates."
 },
 {
  "id": "dop-162",
  "source": "authored",
  "domain": 4,
  "topic": "Load balancer access logs",
  "difficulty": "medium",
  "multi": false,
  "question": "An engineer must determine the client IP addresses and target response times for requests that returned 502 errors through an Application Load Balancer over the past week. Which data source contains this?",
  "choices": {
   "A": "Application Load Balancer access logs delivered to S3, which record per-request client address, target processing time and the ELB and target status codes.",
   "B": "CloudWatch metrics for the load balancer, filtered to the HTTPCode_ELB_5XX_Count metric.",
   "C": "VPC Flow Logs for the subnets containing the load balancer nodes.",
   "D": "CloudTrail management events for the Elastic Load Balancing service."
  },
  "answer": [
   "A"
  ],
  "explanation": "ALB access logs are per-request records containing the client address and port, request processing, target processing and response processing times, the ELB status code and the target status code, which is precisely the per-request detail needed to investigate 502 responses. Option B counts errors over time but carries no per-request attributes, so it can tell you how many and when but not which clients or how slow. Option C records flow-level metadata such as addresses, ports and byte counts, with no HTTP semantics. Option D records API calls that configure the load balancer, not traffic through it."
 },
 {
  "id": "dop-163",
  "source": "authored",
  "domain": 4,
  "topic": "Prometheus-compatible monitoring",
  "difficulty": "medium",
  "multi": false,
  "question": "A team already instruments its Kubernetes workloads with Prometheus client libraries and uses Grafana dashboards. They want to stop operating the Prometheus servers and Grafana instances themselves while keeping their existing queries and dashboards. What should they adopt?",
  "choices": {
   "A": "Amazon Managed Service for Prometheus as the metrics backend, scraped by an agent in the cluster, with Amazon Managed Grafana querying it using the existing PromQL dashboards.",
   "B": "CloudWatch Container Insights, migrating all dashboards to CloudWatch and rewriting the queries in metric math.",
   "C": "AWS X-Ray with the OpenTelemetry collector, replacing the metric dashboards with service maps.",
   "D": "Amazon OpenSearch Service with the Prometheus exporter plugin and OpenSearch Dashboards."
  },
  "answer": [
   "A"
  ],
  "explanation": "The distinguishing requirement is keeping existing PromQL queries and Grafana dashboards while shedding operational burden. Amazon Managed Service for Prometheus is a Prometheus-compatible, managed remote-write backend, and Amazon Managed Grafana is a managed Grafana that can query it, so instrumentation, queries and dashboards carry over. Option B is a valid monitoring approach but explicitly requires rewriting everything, which is the cost being avoided. Option C addresses tracing rather than metrics and discards the dashboards. Option D changes both the storage engine and the dashboard tool, so PromQL queries do not carry over."
 },
 {
  "id": "dop-164",
  "source": "authored",
  "domain": 4,
  "topic": "Monitoring deployments",
  "difficulty": "medium",
  "multi": true,
  "question": "A team wants to correlate a change in error rate with the deployment that caused it. Which TWO practices support this correlation?",
  "choices": {
   "A": "Emit a deployment event or annotation carrying the release version at deploy time, so dashboards and alarms can be overlaid with when changes occurred.",
   "B": "Include the release version as a dimension or structured log field on application telemetry, so metrics and logs can be broken down by version.",
   "C": "Increase the alarm evaluation period so short-lived deployment noise is ignored.",
   "D": "Restrict deployments to a single daily window so any error change must belong to that day's release.",
   "E": "Disable alarms during deployments to avoid false positives from instance replacement."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Correlation needs two things: a record of when changes happened, which a deployment event or dashboard annotation provides, and a way to attribute telemetry to a specific release, which comes from carrying the version as a metric dimension or structured log field so error rates can be compared between versions during a progressive rollout. Option C hides exactly the signal being investigated. Option D narrows the search but still cannot distinguish which of several services deployed that day is responsible, and it slows delivery. Option E is actively dangerous, since deployments are when problems are most likely and silencing alarms removes the detection."
 },
 {
  "id": "dop-165",
  "source": "authored",
  "domain": 4,
  "topic": "Real user monitoring",
  "difficulty": "easy",
  "multi": false,
  "question": "A product team wants to know the page load times, JavaScript errors and navigation paths that real users experience in their browsers, broken down by geography and device. Which service provides this?",
  "choices": {
   "A": "Amazon CloudWatch RUM, which collects client-side performance and error telemetry from a JavaScript snippet embedded in the application.",
   "B": "Amazon CloudWatch Synthetics, which runs scripted browser sessions on a schedule from AWS infrastructure.",
   "C": "AWS X-Ray, which traces requests through backend services.",
   "D": "Application Load Balancer access logs, which record per-request timings."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudWatch RUM is the real user monitoring service: a snippet in the web application reports page load performance, JavaScript errors, HTTP errors and user journeys from actual browsers, with breakdowns including geography, browser and device. Option B produces synthetic traffic from AWS-run canaries, which is complementary but does not reflect what real users experience on their own networks and devices. Option C observes the server side and stops at the backend boundary. Option D measures time spent at the load balancer and target, excluding everything that happens in the browser."
 },
 {
  "id": "dop-166",
  "source": "authored",
  "domain": 4,
  "topic": "High-resolution metrics",
  "difficulty": "medium",
  "multi": false,
  "question": "A trading application needs to detect a metric breach and trigger an alarm within about 20 seconds. Standard CloudWatch alarms on the metric are too slow. What should be configured?",
  "choices": {
   "A": "Publish the metric as a high-resolution custom metric with a one-second storage resolution and configure a high-resolution alarm with a 10-second period.",
   "B": "Enable detailed monitoring so metrics are published every minute instead of every five minutes.",
   "C": "Reduce the number of datapoints to alarm to one while keeping the standard 60-second period.",
   "D": "Create a composite alarm so evaluation happens as soon as any child alarm changes state."
  },
  "answer": [
   "A"
  ],
  "explanation": "Custom metrics can be published with a storage resolution of one second, and alarms on high-resolution metrics support periods of 10 or 30 seconds, which is the only configuration here capable of evaluating and firing within roughly 20 seconds. Option B improves the granularity of EC2 metrics to one minute, which is still far slower than required. Option C reduces the number of periods needed to trigger but each period is still 60 seconds, so the floor remains a minute. Option D changes how alarm states are combined and cannot evaluate faster than its children."
 },
 {
  "id": "dop-167",
  "source": "authored",
  "domain": 4,
  "topic": "Log routing for containers",
  "difficulty": "medium",
  "multi": false,
  "question": "An ECS task must send application logs to two destinations: CloudWatch Logs for operations and a third-party SIEM endpoint for security. Which configuration achieves this within the task definition?",
  "choices": {
   "A": "Use the FireLens log driver with a Fluent Bit sidecar and a configuration that defines two outputs, one for CloudWatch Logs and one for the SIEM endpoint.",
   "B": "Configure the awslogs log driver twice in the container definition with different log group names.",
   "C": "Configure the awslogs driver for CloudWatch Logs and add a CloudWatch Logs subscription filter forwarding to the SIEM.",
   "D": "Mount a shared volume and run a sidecar that tails the log file and posts it to the SIEM."
  },
  "answer": [
   "A"
  ],
  "explanation": "FireLens routes container output through a Fluent Bit or Fluentd sidecar whose configuration can define multiple outputs, so the same stream is delivered to CloudWatch Logs and to an arbitrary third-party endpoint from within the task definition. Option B is invalid, since a container definition accepts a single log configuration. Option C is a workable alternative in some designs but the question asks for the task-definition mechanism, and it adds a CloudWatch Logs hop with its own ingestion cost and latency for data destined elsewhere. Option D reimplements log routing by hand and depends on the application writing to a file rather than to standard output."
 },
 {
  "id": "dop-168",
  "source": "authored",
  "domain": 4,
  "topic": "Metric dimension design",
  "difficulty": "hard",
  "multi": false,
  "question": "A team added a request identifier as a CloudWatch metric dimension and their monitoring bill increased dramatically. What is the underlying reason and the correct practice?",
  "choices": {
   "A": "Each unique combination of dimension values creates a separate custom metric, so an unbounded dimension such as a request identifier generates millions of metrics; high-cardinality attributes belong in logs or the embedded metric format properties rather than in dimensions.",
   "B": "Dimensions are billed per API call, so the cost came from making more PutMetricData requests; batching the calls resolves it.",
   "C": "Dimensions force metrics to high resolution automatically, and reverting to standard resolution resolves the cost.",
   "D": "Dimensions are retained for 15 months regardless of use, and shortening metric retention resolves the cost."
  },
  "answer": [
   "A"
  ],
  "explanation": "In CloudWatch a metric is identified by its namespace, name and the exact set of dimension name-value pairs, so every distinct combination is a separate custom metric with its own charge. A dimension whose values are unbounded, such as a request or user identifier, therefore multiplies the metric count without limit. High-cardinality context belongs in log events, or in embedded metric format properties, where it is queryable without becoming a metric. Option B misstates the pricing model, which charges per custom metric rather than per dimension call. Option C is invented; resolution is set explicitly when publishing. Option D is wrong because metric retention is not configurable and is not the cost driver here."
 },
 {
  "id": "dop-169",
  "source": "authored",
  "domain": 4,
  "topic": "Hybrid monitoring",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs half its workloads on-premises and half on AWS, and wants a single set of dashboards and alarms covering both. Which approach is most practical?",
  "choices": {
   "A": "Install the CloudWatch agent on the on-premises servers with an IAM role obtained through a Systems Manager hybrid activation, so they publish metrics and logs into the same CloudWatch account as the AWS workloads.",
   "B": "Export CloudWatch metrics to an on-premises Prometheus server so all monitoring happens in the data centre.",
   "C": "Build separate dashboards for each environment and have engineers view them side by side.",
   "D": "Rely on AWS Health events, which cover both AWS and on-premises resources."
  },
  "answer": [
   "A"
  ],
  "explanation": "The CloudWatch agent runs on on-premises servers as well as EC2 instances, and a Systems Manager hybrid activation gives those servers an AWS identity to publish under, so their metrics and logs land in the same account and Region as the cloud workloads and can be combined on shared dashboards and alarms. Option B inverts the direction and requires exporting all AWS telemetry to a self-managed system, which is more work and reintroduces the operational burden. Option C is exactly the fragmentation the requirement asks to remove. Option D misstates AWS Health, which reports on AWS service and account events only."
 },
 {
  "id": "dop-170",
  "source": "authored",
  "domain": 4,
  "topic": "Cost observability",
  "difficulty": "medium",
  "multi": false,
  "question": "A finance team wants to be alerted when spending on any service deviates significantly from its historical pattern, without setting a fixed budget threshold for every service. What should be configured?",
  "choices": {
   "A": "AWS Cost Anomaly Detection with monitors by service and an alert subscription, which learns spending patterns and flags unusual changes.",
   "B": "An AWS Budgets budget per service with a fixed monthly amount and an alert at 80% of the amount.",
   "C": "A CloudWatch alarm on the EstimatedCharges metric with a static threshold.",
   "D": "A weekly Cost Explorer report emailed to the finance team for manual review."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cost Anomaly Detection builds a model of normal spending for the monitor's scope — by service, account, cost category or tag — and raises alerts when actual spend deviates from the expected pattern, which is precisely the requirement to avoid setting fixed thresholds everywhere. Option B requires choosing and maintaining an amount for every service, which is the manual work being avoided. Option C is a single account-wide static threshold that cannot detect a service-level anomaly hidden within normal total spend. Option D is a manual review process rather than an alert, and small anomalies are easily missed."
 },
 {
  "id": "dop-171",
  "source": "authored",
  "domain": 4,
  "topic": "Log subscription pipelines",
  "difficulty": "hard",
  "multi": false,
  "question": "A subscription filter forwards a very high volume log group to a Lambda function, and the team observes throttling and lost delivery attempts. Which change best stabilises the pipeline?",
  "choices": {
   "A": "Subscribe an Amazon Kinesis Data Streams stream instead, sized with enough shards for the volume, and consume from it with the processing application so bursts are buffered and reads can be retried from the stream.",
   "B": "Increase the Lambda function memory so it processes each batch faster.",
   "C": "Add a second subscription filter on the same log group to double the delivery capacity.",
   "D": "Reduce the log group retention period so fewer events are delivered."
  },
  "answer": [
   "A"
  ],
  "explanation": "Direct Lambda subscription couples delivery to invocation capacity, so a burst that exceeds available concurrency produces throttling and dropped attempts. Delivering to a Kinesis data stream inserts a durable buffer: shards absorb the burst, records are retained for the stream's retention period, and consumers read at their own pace and can retry, which is the standard architecture for high-volume log subscription. Option B may reduce duration slightly but the constraint is concurrency and delivery rate, not per-invocation speed. Option C duplicates every event to a second destination rather than adding capacity to the first. Option D changes how long stored events are kept and has no effect on the rate at which new events are delivered."
 },
 {
  "id": "dop-172",
  "source": "authored",
  "domain": 4,
  "topic": "Alarm sensitivity tuning",
  "difficulty": "medium",
  "multi": false,
  "question": "An alarm with a 60-second period fires several times a day because of brief single-period spikes that resolve on their own, and the team is ignoring its pages. They still need genuine sustained breaches to alert quickly. What is the appropriate adjustment?",
  "choices": {
   "A": "Configure the alarm with an M out of N evaluation, such as three datapoints to alarm within an evaluation of five periods, so isolated spikes are tolerated while a sustained breach still fires within a few minutes.",
   "B": "Raise the threshold until the spikes no longer cross it.",
   "C": "Change the statistic from average to maximum so the alarm reflects the worst value in each period.",
   "D": "Delete the alarm and rely on the weekly operational review to spot trends."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudWatch alarms separate the number of periods evaluated from the number that must be breaching, so requiring three breaching datapoints out of five suppresses isolated spikes while still alarming within a few minutes on a real sustained problem — the balance the team needs. Option B hides genuine breaches at lower magnitudes and is guesswork. Option C makes the alarm more sensitive to exactly the transient spikes causing the noise. Option D removes detection entirely, and an ignored alarm is a symptom to fix rather than a reason to stop monitoring."
 },
 {
  "id": "dop-173",
  "source": "authored",
  "domain": 4,
  "topic": "Observability for serverless",
  "difficulty": "medium",
  "multi": false,
  "question": "A Lambda function occasionally times out and the team cannot tell which downstream call is responsible, because the timeout kills the invocation before any summary log line is written. What is the most effective change?",
  "choices": {
   "A": "Enable active tracing so segments for downstream calls are recorded as they happen, and log structured events at the start and end of each downstream call rather than only at the end of the invocation.",
   "B": "Increase the function timeout so invocations have more time to complete and write their summary log.",
   "C": "Increase the log retention period so the missing entries can be found later.",
   "D": "Move the function into a VPC so downstream latency can be measured with Flow Logs."
  },
  "answer": [
   "A"
  ],
  "explanation": "The diagnostic gap is that all the information is written at the end, which never arrives when the invocation is killed. Emitting a structured log line before and after each downstream call means the last successful entry identifies where execution stopped, and active tracing records subsegments for downstream calls incrementally so the trace shows the hanging call even for a timed-out invocation. Option B may hide the symptom without explaining it and raises cost for every invocation. Option C preserves logs that were never written in the first place. Option D adds network complexity, and Flow Logs report flow metadata rather than which application call was slow."
 },
 {
  "id": "dop-174",
  "source": "authored",
  "domain": 5,
  "topic": "EventBridge event patterns",
  "difficulty": "medium",
  "multi": false,
  "question": "A DevOps engineer must invoke a remediation function only when an EC2 instance enters the stopped state, and not for any other state transition. Which EventBridge rule configuration is correct?",
  "choices": {
   "A": "An event pattern matching the EC2 Instance State-change Notification detail type with a detail filter on the state value stopped.",
   "B": "A schedule expression that runs every five minutes and calls DescribeInstances to look for stopped instances.",
   "C": "An event pattern matching the source aws.ec2 with no detail filter, and a filter applied in the target function.",
   "D": "An event pattern matching the CloudTrail StopInstances API call event."
  },
  "answer": [
   "A"
  ],
  "explanation": "EventBridge patterns match on the event envelope and its detail, so filtering the EC2 instance state change notification on a detail state of stopped invokes the target only for that transition, with the filtering done by the service before any invocation is billed. Option B polls and reacts late. Option C invokes the function for every EC2 event in the account and pays for invocations that are immediately discarded, which is the anti-pattern EventBridge filtering exists to avoid. Option D matches the API call rather than the resulting state, so it misses instances stopped by other means such as an automated action or an operating system shutdown, and it fires when the call is made rather than when the instance is actually stopped."
 },
 {
  "id": "dop-175",
  "source": "authored",
  "domain": 5,
  "topic": "Automated remediation",
  "difficulty": "medium",
  "multi": false,
  "question": "Security requires that any S3 bucket found with public access must have public access blocked within minutes, automatically, with the action recorded. Which combination provides this?",
  "choices": {
   "A": "An AWS Config rule detecting public buckets, with an automatic remediation action invoking a Systems Manager Automation runbook that applies the public access block, recorded in the Automation execution history and CloudTrail.",
   "B": "An IAM policy denying s3:PutBucketAcl for all principals in the account.",
   "C": "A weekly report from AWS Trusted Advisor listing publicly accessible buckets for manual correction.",
   "D": "S3 Block Public Access enabled at the account level, which prevents the Config rule from ever becoming non-compliant."
  },
  "answer": [
   "A"
  ],
  "explanation": "A Config rule provides continuous detection, and attaching an automatic remediation action ties that detection to a Systems Manager Automation runbook that corrects the resource, with the execution recorded in Automation history and the underlying API calls in CloudTrail. That covers detection, correction and evidence. Option B blocks one mechanism for making a bucket public while leaving policies and other paths, and it does not correct existing buckets. Option C is a manual weekly loop rather than automatic remediation in minutes. Option D is genuinely the strongest preventive control and would be worth adopting, but the question asks for detection and automated remediation, and account-level settings alone provide no remediation record for buckets in accounts where it is not applied."
 },
 {
  "id": "dop-176",
  "source": "authored",
  "domain": 5,
  "topic": "Incident Manager",
  "difficulty": "medium",
  "multi": true,
  "question": "An organisation wants CloudWatch alarms to automatically open an incident, page the correct on-call engineer with escalation if unacknowledged, and start a runbook. Which TWO AWS Systems Manager Incident Manager constructs are involved?",
  "choices": {
   "A": "A response plan, which defines the incident template, engagements and the runbook to start when an incident is created.",
   "B": "An escalation plan referencing contacts with their engagement channels and stage durations, so unacknowledged pages escalate automatically.",
   "C": "A maintenance window that schedules the incident response outside business hours.",
   "D": "A patch baseline that defines the severity classification of the incident.",
   "E": "An Inventory association that records who was on call at the time."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Incident Manager models this with contacts and escalation plans on one side and response plans on the other. The escalation plan orders contacts into stages with durations, so an unacknowledged engagement moves to the next stage automatically, and the response plan ties an alarm or EventBridge event to an incident template, the engagements to start and the Automation runbook to run. Options C and D name Systems Manager features from Patch Manager and maintenance windows that have no role in incident response. Option E misstates Inventory, which collects software and configuration data from managed nodes."
 },
 {
  "id": "dop-177",
  "source": "authored",
  "domain": 5,
  "topic": "Event replay",
  "difficulty": "hard",
  "multi": false,
  "question": "A downstream consumer of an EventBridge bus was misconfigured for six hours and silently discarded events. The team needs to reprocess the events from that window after fixing the consumer. What makes this possible?",
  "choices": {
   "A": "An archive configured on the event bus covering that period, from which a replay can be started for the specific time window and rule.",
   "B": "A dead-letter queue on the rule target, which retains the discarded events.",
   "C": "CloudTrail data events for EventBridge, from which the events can be reconstructed.",
   "D": "EventBridge Pipes, which buffer events until a consumer acknowledges them."
  },
  "answer": [
   "A"
  ],
  "explanation": "An event bus archive stores events as they are published, with a retention period, and a replay re-emits archived events from a chosen time window to the rules you select — which is exactly the recovery described, but only if the archive existed at the time. Option B captures events that EventBridge failed to deliver, and here delivery succeeded; the consumer accepted and discarded them, so nothing reaches the dead-letter queue. Option C records API activity rather than event payloads, so the events cannot be reconstructed. Option D misstates Pipes, which is a point-to-point integration between a source and a target and does not provide acknowledgement-based buffering of bus events."
 },
 {
  "id": "dop-178",
  "source": "authored",
  "domain": 5,
  "topic": "AWS Health events",
  "difficulty": "medium",
  "multi": false,
  "question": "A DevOps team wants automated notification when AWS schedules maintenance or reports degradation affecting resources in any account of their organisation, so they can act before customers are impacted. What should they configure?",
  "choices": {
   "A": "Enable organizational view for AWS Health and create an EventBridge rule on the aws.health source in the management or delegated administrator account, targeting a notification and automation workflow.",
   "B": "Subscribe to the public AWS Service Health Dashboard RSS feed and forward it to a chat channel.",
   "C": "Create a CloudWatch alarm on the AWS Health metric namespace for each affected service.",
   "D": "Poll the DescribeEvents API from each member account on a schedule and aggregate the results centrally."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Health publishes account-specific and resource-specific events to EventBridge under the aws.health source, and organizational view aggregates those events across every account in the organisation into the management or delegated administrator account, so one rule covers the whole estate and can drive both notification and automated response. Option B carries only broad public service status without account or resource specificity, so it misses scheduled maintenance on particular instances. Option C is invented, since Health does not publish a CloudWatch metric namespace of this kind. Option D would work but requires per-account polling infrastructure that the organizational view and EventBridge integration replace."
 },
 {
  "id": "dop-179",
  "source": "authored",
  "domain": 5,
  "topic": "Troubleshooting failed deployments",
  "difficulty": "hard",
  "multi": false,
  "question": "A CloudFormation stack update fails and enters UPDATE_ROLLBACK_FAILED. The team cannot run further updates. What is the correct recovery procedure?",
  "choices": {
   "A": "Identify the resources that failed to roll back from the stack events, fix the underlying cause manually, then call ContinueUpdateRollback, optionally skipping the resources that cannot be rolled back so the stack returns to UPDATE_ROLLBACK_COMPLETE.",
   "B": "Delete the stack and redeploy it from the template, since UPDATE_ROLLBACK_FAILED is terminal.",
   "C": "Run a new stack update with the corrected template, which supersedes the failed rollback.",
   "D": "Enable termination protection and wait for CloudFormation to retry the rollback automatically."
  },
  "answer": [
   "A"
  ],
  "explanation": "UPDATE_ROLLBACK_FAILED means CloudFormation could not return the stack to its previous state, usually because a resource cannot be restored — a security group still in use, a bucket that is not empty, a manual change that conflicts. The supported recovery is to fix the blocking condition and call ContinueUpdateRollback, with the option to skip named resources that cannot be rolled back so the operation can complete. Option B destroys production resources unnecessarily, and the state is recoverable. Option C is not permitted, since the stack rejects new updates until the rollback completes. Option D is wrong on both counts, as termination protection is unrelated and CloudFormation does not retry on its own."
 },
 {
  "id": "dop-180",
  "source": "authored",
  "domain": 5,
  "topic": "Dead-letter queue recovery",
  "difficulty": "medium",
  "multi": false,
  "question": "After a bug was fixed, several thousand messages remain in a dead-letter queue and must be reprocessed by the original consumer. What is the most operationally efficient way to do this?",
  "choices": {
   "A": "Start an SQS dead-letter queue redrive task, which moves the messages back to the source queue for the existing consumer to process, with a configurable velocity.",
   "B": "Write a Lambda function that receives from the dead-letter queue and sends each message to the source queue, and invoke it repeatedly until the queue is empty.",
   "C": "Change the consumer's event source mapping to point at the dead-letter queue until it is drained, then change it back.",
   "D": "Purge the dead-letter queue and ask upstream producers to resend the affected messages."
  },
  "answer": [
   "A"
  ],
  "explanation": "SQS provides a built-in dead-letter queue redrive that moves messages back to the source queue, or to a different destination, with a controllable rate so the consumer is not overwhelmed, and progress is reported by the service. Option B is the manual implementation of that feature, with retries, batching and error handling to write and monitor. Option C works but changes the running configuration of the consumer, risks messages arriving on the wrong queue during the switch, and is easy to forget to revert. Option D discards the data and assumes producers retained it, which is rarely true."
 },
 {
  "id": "dop-181",
  "source": "authored",
  "domain": 5,
  "topic": "Proactive anomaly detection",
  "difficulty": "medium",
  "multi": false,
  "question": "An operations team wants a service that automatically analyses their AWS resources and operational data to surface anomalous behaviour and likely root causes, without them defining every alarm in advance. Which service is designed for this?",
  "choices": {
   "A": "Amazon DevOps Guru, which applies machine learning to CloudWatch metrics, CloudTrail events and resource configuration to generate insights with related anomalies and recommendations.",
   "B": "AWS Trusted Advisor, which checks resources against a fixed set of best practice rules.",
   "C": "AWS Compute Optimizer, which recommends instance types based on utilisation history.",
   "D": "AWS Config, which records configuration changes and evaluates them against rules."
  },
  "answer": [
   "A"
  ],
  "explanation": "DevOps Guru ingests metrics, events and configuration for the resources you enrol, learns normal behaviour, and raises insights that group correlated anomalies with a likely cause and recommended actions — precisely the described capability of finding problems without predefined alarms. Option B evaluates a fixed catalogue of best practice checks and does not learn behaviour. Option C is a right-sizing service focused on cost and performance efficiency. Option D is a configuration recorder with rule-based evaluation, so it detects only what a rule already describes."
 },
 {
  "id": "dop-182",
  "source": "authored",
  "domain": 5,
  "topic": "SNS message filtering",
  "difficulty": "medium",
  "multi": false,
  "question": "A single SNS topic receives events of several types. Three subscribers each care about only one type, but currently all three receive everything and discard most messages. What should be configured?",
  "choices": {
   "A": "A subscription filter policy on each subscription, matching a message attribute or message body property, so SNS delivers only the relevant messages to each subscriber.",
   "B": "Three separate SNS topics, with the publisher choosing which topic to publish each event to.",
   "C": "An SQS queue between the topic and each subscriber, with the consumer filtering messages after receipt.",
   "D": "An EventBridge rule subscribed to the topic, with three targets and a pattern for each."
  },
  "answer": [
   "A"
  ],
  "explanation": "SNS subscription filter policies evaluate message attributes, or properties of the message body when body-based filtering is enabled, and deliver only matching messages to that subscription, so filtering happens in the service and subscribers stop paying to receive and discard messages. Option B works but pushes routing knowledge into the publisher, which must then be changed whenever a new event type or subscriber appears. Option C still delivers everything and moves the discarding one hop later, adding cost. Option D introduces a second routing service to do what SNS already supports natively on the existing topic."
 },
 {
  "id": "dop-183",
  "source": "authored",
  "domain": 5,
  "topic": "GuardDuty finding response",
  "difficulty": "medium",
  "multi": false,
  "question": "When Amazon GuardDuty reports that an EC2 instance is communicating with a known command-and-control host, the security team wants the instance isolated automatically for forensics, without terminating it. Which automated response is appropriate?",
  "choices": {
   "A": "An EventBridge rule matching the GuardDuty finding type that invokes a Systems Manager Automation runbook to replace the instance security groups with an isolation group, create a snapshot of its volumes, and tag it for investigation.",
   "B": "An EventBridge rule that invokes a Lambda function to terminate the instance immediately.",
   "C": "An AWS Config rule that marks the instance non-compliant and notifies the security team.",
   "D": "A GuardDuty suppression rule for the finding type so the noise stops while the team investigates."
  },
  "answer": [
   "A"
  ],
  "explanation": "GuardDuty publishes findings to EventBridge, so a rule on the finding type can drive an Automation runbook that performs containment: swapping to a security group with no egress isolates the instance while leaving it running, snapshots preserve volume state, and tagging records the incident. Option B destroys the memory and disk state the forensics require. Option C detects and notifies but performs no containment, so the compromised host keeps communicating. Option D hides the finding rather than responding to it, which is the opposite of the requirement."
 },
 {
  "id": "dop-184",
  "source": "authored",
  "domain": 5,
  "topic": "Scheduled instance retirement",
  "difficulty": "medium",
  "multi": false,
  "question": "AWS has scheduled several EC2 instances for retirement. The team wants these events handled automatically by replacing affected instances during a maintenance window rather than being discovered when the instance stops. What should be implemented?",
  "choices": {
   "A": "An EventBridge rule on the AWS Health event for scheduled EC2 instance retirement that starts an Automation runbook to drain and replace the affected instance, scheduling the action within the permitted window.",
   "B": "A weekly manual review of the Personal Health Dashboard by the operations team.",
   "C": "A CloudWatch alarm on the StatusCheckFailed metric so the instance is recovered when retirement takes effect.",
   "D": "An Auto Scaling group health check set to EC2 so the instance is replaced after it stops."
  },
  "answer": [
   "A"
  ],
  "explanation": "Instance retirement is announced in advance as an AWS Health event, which is delivered to EventBridge, so a rule can trigger an Automation runbook that replaces the instance on the team's own schedule before the deadline. That is the proactive handling the requirement describes. Option B relies on someone remembering to look and is not automated. Option C reacts only once the instance has already stopped, which is the discovery pattern being replaced, and recovery does not resolve a retirement. Option D also acts after the outage has occurred rather than before it."
 },
 {
  "id": "dop-185",
  "source": "authored",
  "domain": 5,
  "topic": "Cross-account event routing",
  "difficulty": "hard",
  "multi": false,
  "question": "Security findings generated in 30 member accounts must be routed to a central security account for processing, using EventBridge. What is the correct configuration?",
  "choices": {
   "A": "Create a custom event bus in the security account with a resource policy allowing the organisation to put events, and in each member account create a rule whose target is that central bus.",
   "B": "Create a rule in the security account whose event pattern includes the member account IDs, since EventBridge automatically receives events from all accounts in the organisation.",
   "C": "Configure each member account to publish findings to an SNS topic in the security account, since EventBridge cannot cross account boundaries.",
   "D": "Enable an organization trail so member account events are delivered to the security account event bus."
  },
  "answer": [
   "A"
  ],
  "explanation": "Cross-account event delivery works by making the destination bus a target: the central bus carries a resource policy permitting the organisation or specific accounts to call PutEvents, and each source account has a rule that forwards matching events to that bus ARN. Option B is wrong because event buses receive only their own account's events unless something forwards them. Option C is wrong on its premise, since EventBridge supports cross-account targets directly. Option D confuses CloudTrail delivery to S3 with EventBridge event routing, which are different mechanisms."
 },
 {
  "id": "dop-186",
  "source": "authored",
  "domain": 5,
  "topic": "Runbook automation and approvals",
  "difficulty": "medium",
  "multi": false,
  "question": "A recovery runbook must be executed by first-line operators who should not hold the IAM permissions the runbook needs. How can this be achieved safely?",
  "choices": {
   "A": "Run the Systems Manager Automation document with an assume role that carries the required permissions, and grant operators only permission to start that specific Automation document.",
   "B": "Grant the operators the full permission set required by the runbook, restricted by a permission boundary.",
   "C": "Have the operators request temporary credentials from a senior engineer each time the runbook is needed.",
   "D": "Store an access key with the required permissions in the runbook document so it runs with elevated rights."
  },
  "answer": [
   "A"
  ],
  "explanation": "Automation documents can specify an assume role that the service uses to perform the steps, so the elevated permissions belong to that role rather than to the caller, and operators need only ssm:StartAutomationExecution scoped to the specific document. This is privilege delegation through a constrained, audited path. Option B still grants the operators the underlying permissions, which they can then use outside the runbook. Option C is a manual bottleneck that defeats the purpose of automating recovery. Option D embeds long-lived credentials in a document, which is both a serious exposure and unnecessary."
 },
 {
  "id": "dop-187",
  "source": "authored",
  "domain": 5,
  "topic": "Alarm-driven scaling response",
  "difficulty": "medium",
  "multi": false,
  "question": "An SQS-backed worker fleet falls behind during bursts because scaling is based on CPU utilisation, which stays low while the workers wait on I/O. What metric should drive scaling instead?",
  "choices": {
   "A": "A target tracking policy on a backlog-per-instance metric, computed from ApproximateNumberOfMessagesVisible divided by the number of in-service instances.",
   "B": "A step scaling policy on the ApproximateAgeOfOldestMessage metric with a fixed instance increment.",
   "C": "A target tracking policy on the NetworkIn metric of the worker instances.",
   "D": "A scheduled scaling action sized for the largest historical burst."
  },
  "answer": [
   "A"
  ],
  "explanation": "Queue depth alone does not tell you whether the fleet is adequately sized, because the acceptable depth depends on how many workers exist. Backlog per instance — visible messages divided by in-service instances — is the standard derived metric for queue-driven scaling and is exactly what a target tracking policy needs, since it expresses a value that should be held constant. Option B is a workable secondary signal but message age is a lagging indicator and fixed increments do not adapt to burst size. Option C is a weak proxy that reflects payload size as much as workload. Option D pays for peak capacity continuously and still fails on an unusually large burst."
 },
 {
  "id": "dop-188",
  "source": "authored",
  "domain": 5,
  "topic": "Postmortem practice",
  "difficulty": "medium",
  "multi": false,
  "question": "After a significant outage, a team wants their review process to reduce the chance of recurrence rather than assign blame. Which practice best supports this?",
  "choices": {
   "A": "Hold a blameless postmortem that establishes a factual timeline, identifies contributing systemic factors, and produces owned, tracked action items with due dates.",
   "B": "Identify the engineer whose change triggered the incident and require additional review of their future changes.",
   "C": "Record the incident duration and severity in a spreadsheet for trend reporting.",
   "D": "Add an alarm for the specific metric that breached, and close the incident once it is created."
  },
  "answer": [
   "A"
  ],
  "explanation": "A blameless postmortem focuses on the conditions that allowed the failure — missing guardrails, unclear signals, brittle dependencies — because systems rather than individuals produce outages, and it converts findings into tracked, owned actions so the learning results in change. Option B discourages the honest disclosure that a useful review depends on and treats a person as the root cause. Option C records that incidents happened without extracting any learning. Option D fixes the narrowest possible symptom, so the same class of failure recurs through a different metric."
 },
 {
  "id": "dop-189",
  "source": "authored",
  "domain": 5,
  "topic": "OpsCenter",
  "difficulty": "medium",
  "multi": false,
  "question": "An operations team wants operational issues raised by CloudWatch alarms, Config rules and DevOps Guru insights to appear in a single work queue with contextual resource data and runbooks attached, inside AWS. Which service provides this?",
  "choices": {
   "A": "AWS Systems Manager OpsCenter, which aggregates OpsItems from multiple sources and associates related resources and Automation runbooks for resolution.",
   "B": "AWS Systems Manager Inventory, which collects software and configuration data from managed nodes.",
   "C": "Amazon CloudWatch dashboards, with one widget per issue source.",
   "D": "AWS Service Catalog, with each issue represented as a provisioned product."
  },
  "answer": [
   "A"
  ],
  "explanation": "OpsCenter is the operational work queue within Systems Manager: OpsItems are created from CloudWatch alarms, Config rule evaluations, DevOps Guru insights, Security Hub findings and custom sources, and each item carries related resource details and can have Automation runbooks attached and run in place. Option B gathers node inventory data and is not a work queue. Option C visualises metrics but has no concept of an issue with state, ownership and resolution. Option D provisions approved products and has nothing to do with operational issue tracking."
 },
 {
  "id": "dop-190",
  "source": "authored",
  "domain": 5,
  "topic": "Security Hub automation",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team wants findings of a specific type and severity to be automatically suppressed when they relate to a known accepted risk on tagged resources, without writing code. Which feature should they use?",
  "choices": {
   "A": "Security Hub automation rules, which evaluate findings on ingestion against criteria and update fields such as workflow status or severity automatically.",
   "B": "An EventBridge rule matching the finding and a Lambda function that calls BatchUpdateFindings.",
   "C": "A Security Hub insight that groups findings by resource tag for review.",
   "D": "Disabling the underlying control in the security standard so the finding is never generated."
  },
  "answer": [
   "A"
  ],
  "explanation": "Security Hub automation rules run at ingestion and apply changes to matching findings — setting workflow status to suppressed, adjusting severity, adding notes — based on criteria such as resource tags, finding type and severity, all configured rather than coded. Option B achieves the same result but is exactly the code the requirement asks to avoid, and it must be maintained and monitored. Option C provides a saved grouping for human review and changes nothing about the findings. Option D suppresses the control globally, so genuine violations on untagged, unaccepted resources are also lost."
 },
 {
  "id": "dop-191",
  "source": "authored",
  "domain": 5,
  "topic": "EventBridge Pipes",
  "difficulty": "hard",
  "multi": false,
  "question": "A team needs to consume records from a DynamoDB stream, filter out records that do not matter, enrich the remainder with data from a Lambda function, and deliver the result to a Step Functions state machine, with as little glue code as possible. Which service fits?",
  "choices": {
   "A": "Amazon EventBridge Pipes, which provides a point-to-point integration with built-in source polling, filtering, an optional enrichment step and a target.",
   "B": "An EventBridge rule on the default bus with an input transformer and a Step Functions target.",
   "C": "A Lambda function with a DynamoDB stream event source mapping that performs the filtering, enrichment and StartExecution call.",
   "D": "Amazon Data Firehose with a transformation Lambda function delivering to Step Functions."
  },
  "answer": [
   "A"
  ],
  "explanation": "Pipes is designed for exactly this shape: it polls a supported source such as a DynamoDB stream, applies a filter so non-matching records are discarded before any billing for enrichment, calls an optional enrichment such as a Lambda function or API destination, and delivers to a target such as a state machine — with no polling loop or delivery code to write. Option B is wrong because DynamoDB streams are not an event bus source, so the rule would never receive the records. Option C works but is the glue code the requirement seeks to minimise, and the filtering happens after invocation. Option D does not support Step Functions as a delivery destination."
 },
 {
  "id": "dop-192",
  "source": "authored",
  "domain": 5,
  "topic": "Incident communication",
  "difficulty": "easy",
  "multi": false,
  "question": "During a major incident, stakeholders repeatedly interrupt the responding engineers for status updates, slowing the response. Which practice addresses this?",
  "choices": {
   "A": "Assign an incident commander who owns coordination and designate a communications lead who posts regular updates on a defined channel, leaving responders to focus on diagnosis and mitigation.",
   "B": "Ask stakeholders to wait until the incident is resolved before requesting any information.",
   "C": "Give stakeholders read access to the monitoring dashboards so they can interpret the metrics themselves.",
   "D": "Move all incident discussion to email so that responders can answer in batches."
  },
  "answer": [
   "A"
  ],
  "explanation": "Defined incident roles are the standard remedy: an incident commander coordinates and makes decisions, and a communications lead provides regular structured updates to stakeholders on a known channel, which satisfies the legitimate need for information without interrupting the people diagnosing the problem. Option B leaves a real need unmet, so stakeholders escalate through other routes. Option C hands raw metrics to people without the context to interpret them, which usually generates more questions. Option D adds latency and fragments the response record without removing the interruptions."
 },
 {
  "id": "dop-193",
  "source": "authored",
  "domain": 5,
  "topic": "Config remediation for tagging",
  "difficulty": "medium",
  "multi": false,
  "question": "Resources are regularly created without the mandatory CostCenter tag. The team wants non-compliant resources tagged from their owning stack automatically, and repeat offenders visible in a report. What should be configured?",
  "choices": {
   "A": "An AWS Config required-tags rule with an automatic remediation action that runs a Systems Manager Automation runbook to apply the tag, with the rule's compliance history providing the report.",
   "B": "An SCP denying resource creation when the CostCenter tag is absent, applied to all workload accounts.",
   "C": "A nightly script that lists all resources and applies the tag where missing.",
   "D": "A tag policy in AWS Organizations, which blocks the creation of untagged resources."
  },
  "answer": [
   "A"
  ],
  "explanation": "The requirement has two parts — automatic correction and a compliance record — and a Config rule with attached remediation provides both: the required-tags managed rule evaluates resources continuously, the remediation action applies the tag through an Automation runbook, and Config retains compliance history per resource over time. Option B is a strong preventive control worth having, but it blocks rather than remediates and produces no compliance report. Option C reimplements the remediation with a script to maintain and reports nothing. Option D misstates tag policies, which define permitted keys and values and report non-compliance but do not by themselves block creation of untagged resources."
 },
 {
  "id": "dop-194",
  "source": "authored",
  "domain": 5,
  "topic": "ECS task failure investigation",
  "difficulty": "medium",
  "multi": false,
  "question": "An ECS service repeatedly starts and stops tasks. The team needs to know why each task stopped, programmatically, so they can alert on specific causes. Which approach provides the reason?",
  "choices": {
   "A": "An EventBridge rule on the ECS Task State Change event, inspecting the stoppedReason and container exit codes in the event detail.",
   "B": "A CloudWatch alarm on the service's RunningTaskCount metric.",
   "C": "CloudTrail management events for the ECS StopTask API call.",
   "D": "The ECS service's CPU and memory utilisation metrics in Container Insights."
  },
  "answer": [
   "A"
  ],
  "explanation": "ECS emits a task state change event to EventBridge for every transition, and the detail includes stoppedReason, stopCode and each container's exit code, which is exactly the machine-readable cause needed to alert on specific failure types such as an out-of-memory kill or a failed health check. Option B tells you the count changed but not why. Option C records only tasks stopped by an explicit API call, missing tasks that exited on their own or were stopped by the scheduler. Option D shows resource consumption trends, which may hint at a memory problem but does not report the stop reason."
 },
 {
  "id": "dop-195",
  "source": "authored",
  "domain": 5,
  "topic": "Step Functions for operational workflows",
  "difficulty": "medium",
  "multi": false,
  "question": "An incident response workflow must run several remediation steps, wait for a human decision at one point with a timeout of two hours, and take a different path if no decision arrives. Which implementation is most appropriate?",
  "choices": {
   "A": "A Step Functions standard workflow using a task with the wait-for-callback pattern and a heartbeat or timeout, with a Catch on the timeout error routing to the fallback path.",
   "B": "A Lambda function that polls a DynamoDB table for the decision every minute for two hours.",
   "C": "An SQS queue with a two-hour visibility timeout, where the absence of a delete signals no decision.",
   "D": "An EventBridge scheduled rule that runs the remaining steps two hours later regardless of the decision."
  },
  "answer": [
   "A"
  ],
  "explanation": "Standard workflows can run for up to a year and support the wait-for-callback integration pattern, where a task pauses until an external caller returns a task token; a timeout on that task raises an error that Catch routes to the alternative branch. That expresses the human-in-the-loop step and its timeout declaratively with full execution history. Option B exceeds the Lambda 15-minute limit and burns billed duration waiting. Option C abuses queue semantics to represent a decision and provides no branching. Option D ignores the decision entirely and always proceeds after two hours."
 },
 {
  "id": "dop-196",
  "source": "authored",
  "domain": 5,
  "topic": "Detecting deployment-induced regressions",
  "difficulty": "hard",
  "multi": true,
  "question": "A team wants a bad deployment to be detected and reversed automatically, minimising the number of customers affected. Which TWO mechanisms directly support this?",
  "choices": {
   "A": "CloudWatch alarms associated with the CodeDeploy deployment group so the deployment rolls back automatically when the alarm enters the ALARM state.",
   "B": "A progressive traffic shifting configuration such as canary or linear, so only a fraction of traffic reaches the new version while the alarms are evaluated.",
   "C": "Increasing the health check grace period so instances have more time to stabilise before they are evaluated.",
   "D": "Deploying during a low-traffic window so fewer customers are exposed to a defect.",
   "E": "Enabling termination protection on the instances running the previous version."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Automatic reversal needs a detection signal and a limited exposure window. Alarms wired into the deployment group give CodeDeploy an objective trigger to roll back without human involvement, and progressive traffic shifting ensures only a small share of requests reaches the new version during the period when those alarms are being evaluated. Option C makes the deployment less sensitive to failures, delaying detection. Option D reduces the number of affected customers in absolute terms but also reduces the traffic available to detect the regression, and it automates nothing. Option E prevents instance termination and has no role in detecting or reversing a bad release."
 },
 {
  "id": "dop-197",
  "source": "authored",
  "domain": 5,
  "topic": "Service quota automation",
  "difficulty": "medium",
  "multi": false,
  "question": "A platform team wants quota increase requests to be raised automatically when utilisation of a supported quota exceeds 80%, rather than discovered during an incident. What should they build?",
  "choices": {
   "A": "A CloudWatch alarm on the Service Quotas usage metric that triggers a Lambda function or Automation runbook calling RequestServiceQuotaIncrease, with a notification to the team.",
   "B": "A scheduled Lambda function that calls RequestServiceQuotaIncrease for every quota in the account each month.",
   "C": "An AWS Config rule evaluating quota utilisation and marking the account non-compliant.",
   "D": "A Trusted Advisor check with an SNS notification on the service limits category."
  },
  "answer": [
   "A"
  ],
  "explanation": "Service Quotas publishes usage metrics to CloudWatch for supported quotas, so an alarm at 80% utilisation can drive an automated increase request through the Service Quotas API, with a notification so the team knows a request is in flight. Option B raises requests for quotas that do not need them, which is noisy and may be rejected. Option C reports a compliance state but takes no action toward increasing the quota. Option D provides useful visibility on some limits and can notify, but it does not raise the request, so it stops short of the automation described."
 },
 {
  "id": "dop-198",
  "source": "authored",
  "domain": 5,
  "topic": "S3 event-driven processing",
  "difficulty": "medium",
  "multi": false,
  "question": "An object uploaded to S3 must trigger processing exactly once, and the processing system must survive a multi-hour outage of the consumer without losing uploads. Which configuration is best?",
  "choices": {
   "A": "Configure the S3 event notification to deliver to an SQS queue that the consumer polls, so events are durably retained until processed, with a dead-letter queue for repeated failures.",
   "B": "Configure the S3 event notification to invoke a Lambda function directly, relying on Lambda's built-in retries.",
   "C": "Configure the S3 event notification to publish to an SNS topic with the consumer subscribed over HTTPS.",
   "D": "Have the consumer list the bucket every five minutes and process objects it has not seen before."
  },
  "answer": [
   "A"
  ],
  "explanation": "An SQS queue between S3 and the consumer decouples them durably: messages are retained for up to 14 days, so a multi-hour consumer outage causes a backlog rather than data loss, and a dead-letter queue isolates messages that repeatedly fail. Option B retries asynchronous invocations for a limited period, typically several hours at most and subject to throttling, so a long outage loses events unless a destination is also configured. Option C loses messages when the HTTPS endpoint is down beyond the retry policy, since SNS has no durable per-subscriber backlog. Option D repeatedly lists a growing bucket, which is slow, expensive and requires its own record of what has been processed."
 },
 {
  "id": "dop-199",
  "source": "authored",
  "domain": 5,
  "topic": "Escalation design",
  "difficulty": "medium",
  "multi": false,
  "question": "A team finds that low-severity alerts routinely page the on-call engineer overnight, causing fatigue and slower response to genuine emergencies. Which change best addresses this?",
  "choices": {
   "A": "Route alerts by severity: page only for conditions that require immediate human action, and send everything else to a ticket queue reviewed during business hours.",
   "B": "Add a second on-call engineer so the overnight load is shared.",
   "C": "Increase all alarm thresholds until overnight pages stop.",
   "D": "Disable all alerting between midnight and 06:00."
  },
  "answer": [
   "A"
  ],
  "explanation": "Alert fatigue is a routing problem: the fix is to distinguish conditions that genuinely require someone awake now from those that can wait, sending the former to a pager and the latter to a queue, so the pager retains its meaning and urgent alerts get fast attention. Option B doubles the cost of the problem without reducing the noise. Option C raises thresholds indiscriminately, so real problems are missed at lower magnitudes. Option D creates a blind window overnight, which is when unattended failures do the most damage."
 },
 {
  "id": "dop-200",
  "source": "authored",
  "domain": 5,
  "topic": "Lambda asynchronous retry behaviour",
  "difficulty": "hard",
  "multi": false,
  "question": "An asynchronously invoked Lambda function occasionally processes the same event twice, causing duplicate downstream records. What explains this and what is the correct mitigation?",
  "choices": {
   "A": "Asynchronous invocation retries on error and can deliver an event more than once, so the function must be idempotent — for example by recording a deduplication key derived from the event before performing the side effect.",
   "B": "The function's reserved concurrency is too low, causing throttled events to be delivered to two execution environments; raising it removes duplicates.",
   "C": "The event source is publishing duplicates; enabling FIFO on the source removes them.",
   "D": "The function timeout is too short, so Lambda restarts the invocation midway; increasing it prevents duplicates."
  },
  "answer": [
   "A"
  ],
  "explanation": "Lambda's asynchronous invocation model retries on function errors and can deliver an event more than once even without an error, so at-least-once delivery is the documented behaviour and duplicate side effects must be prevented in the function through idempotency, typically a conditional write on a key derived from the event. Option B misdescribes throttling, which causes retries rather than simultaneous duplicate delivery, and raising concurrency does not make delivery exactly-once. Option C assumes a source that may not support FIFO and does not address Lambda's own retry behaviour. Option D describes a real cause of retries but increasing the timeout only reduces one trigger; duplicates remain possible."
 },
 {
  "id": "dop-201",
  "source": "authored",
  "domain": 5,
  "topic": "Chat-based operations",
  "difficulty": "easy",
  "multi": false,
  "question": "A team wants alarms delivered to Slack and wants to run a limited set of read-only AWS commands from the channel during incidents, with permissions controlled by IAM. Which service supports this?",
  "choices": {
   "A": "AWS Chatbot, configured with an SNS topic for notifications and a channel IAM role with a channel guardrail policy limiting which actions can be run.",
   "B": "Amazon Q Developer, which answers questions about AWS services in the console.",
   "C": "A Lambda function with a Slack incoming webhook, invoked by SNS.",
   "D": "Amazon Simple Notification Service with a Slack protocol subscription."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Chatbot connects SNS topics to Slack or Microsoft Teams channels, formats AWS notifications, and supports running AWS CLI commands from the channel under a channel IAM role constrained by guardrail policies, which is precisely the notification plus limited command capability described. Option B is a conversational assistant and does not provide channel notification routing or command execution with IAM guardrails. Option C delivers notifications but provides no command capability and requires building and securing the integration. Option D is wrong because SNS has no native Slack subscription protocol."
 },
 {
  "id": "dop-202",
  "source": "authored",
  "domain": 5,
  "topic": "Auto Scaling event handling",
  "difficulty": "medium",
  "multi": false,
  "question": "A team must run a registration step in an external inventory system whenever an Auto Scaling group launches an instance, and the instance must not enter service until the registration succeeds. What should be implemented?",
  "choices": {
   "A": "A launch lifecycle hook that holds the instance in Pending:Wait, with an EventBridge rule on the lifecycle action event invoking a function that registers the instance and then calls CompleteLifecycleAction.",
   "B": "An EventBridge rule on the EC2 Instance Launch Successful event invoking a function that registers the instance.",
   "C": "A user data script that performs the registration during boot.",
   "D": "A State Manager association that registers instances on a five-minute schedule."
  },
  "answer": [
   "A"
  ],
  "explanation": "The distinguishing requirement is that the instance must not enter service until registration completes, which only a launch lifecycle hook provides: the instance is held in Pending:Wait, the hook emits an event that drives the registration, and CompleteLifecycleAction releases it into service, with the heartbeat timeout bounding the wait. Option B fires after the instance is already in service, so traffic can arrive before registration. Option C runs in the guest and its failure is invisible to the Auto Scaling group, which will place the instance in service regardless. Option D registers up to five minutes late and is unrelated to the instance lifecycle."
 },
 {
  "id": "dop-203",
  "source": "authored",
  "domain": 5,
  "topic": "Pipeline failure response",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants failed CodePipeline executions to automatically create a tracked work item with the failing stage, action and error, so failures are triaged rather than forgotten. What is the most direct implementation?",
  "choices": {
   "A": "An EventBridge rule matching the CodePipeline Action Execution State Change event with a state of FAILED, targeting a function or Automation runbook that creates an OpsItem or ticket containing the event detail.",
   "B": "A CodeBuild action at the end of the pipeline that creates a ticket if any earlier stage failed.",
   "C": "A CloudWatch alarm on the pipeline's execution duration metric.",
   "D": "A daily scheduled job that calls ListPipelineExecutions and creates tickets for failures found."
  },
  "answer": [
   "A"
  ],
  "explanation": "CodePipeline publishes pipeline, stage and action level state change events to EventBridge, and the action-level event detail names the stage, action and failure information, so a rule matching a FAILED state can create a work item populated with the specific context. Option B cannot run, because a failure in an earlier stage prevents the pipeline from reaching the final action. Option C measures how long executions take, which is unrelated to whether they failed. Option D introduces up to a day of delay and requires reconciliation logic to avoid duplicate tickets."
 },
 {
  "id": "dop-204",
  "source": "authored",
  "domain": 5,
  "topic": "EC2 recovery options",
  "difficulty": "medium",
  "multi": false,
  "question": "An EC2 instance backing a legacy application must be recovered automatically when underlying hardware fails, retaining its instance ID, private IP address and EBS volumes. Which mechanism does this?",
  "choices": {
   "A": "Simplified automatic recovery, or a CloudWatch alarm with the EC2 recover action, which restarts the instance on new hardware retaining its instance ID, private IPv4 address, Elastic IP address and EBS volume attachments.",
   "B": "An Auto Scaling group with a minimum and maximum size of one, which replaces the instance when it fails.",
   "C": "An AWS Backup plan that restores the most recent instance backup when a status check fails.",
   "D": "EBS Multi-Attach on the root volume so a second instance can take over."
  },
  "answer": [
   "A"
  ],
  "explanation": "Instance recovery migrates the instance to new underlying hardware while preserving its identity — instance ID, private IPv4 address, any Elastic IP and its EBS volume attachments — which is what a legacy application depending on a fixed address needs. It is available automatically for supported instance types and can also be driven by an alarm action on the system status check. Option B replaces the instance, producing a new instance ID and private IP, and instance store data is lost. Option C restores to a new instance and takes far longer, and AWS Backup does not trigger on status checks. Option D is not applicable, since Multi-Attach supports specific volume types and not root volumes."
 },
 {
  "id": "dop-205",
  "source": "authored",
  "domain": 5,
  "topic": "Incident severity classification",
  "difficulty": "easy",
  "multi": false,
  "question": "A team's incident process treats every alert identically, so a minor background job failure receives the same response as a full customer-facing outage. What should be introduced?",
  "choices": {
   "A": "A severity model tied to customer impact, with defined response expectations, escalation paths and communication requirements for each level.",
   "B": "A rule that the first responder decides how much effort each incident deserves.",
   "C": "A policy that all incidents must be resolved within one hour regardless of type.",
   "D": "A single shared channel where all alerts are posted for whoever is available to pick up."
  },
  "answer": [
   "A"
  ],
  "explanation": "Severity levels defined by customer impact let the organisation match its response to the stakes: who is paged, how quickly, who must be informed and how often, and what may wait until morning. That is what separates a background job failure from an outage. Option B produces inconsistent handling that depends on who is on call and provides no shared expectations. Option C applies an arbitrary uniform target that is unattainable for large incidents and wasteful for small ones. Option D removes ownership entirely, so urgent items can sit unclaimed."
 },
 {
  "id": "dop-206",
  "source": "authored",
  "domain": 5,
  "topic": "Detecting new error patterns",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants to be alerted when a previously unseen error signature starts appearing in their application logs, without predefining a metric filter for every possible message. Which capability helps?",
  "choices": {
   "A": "CloudWatch Logs anomaly detection on the log group, which learns the normal patterns of log content and surfaces new or unusually frequent patterns.",
   "B": "A metric filter with a wildcard pattern matching any line containing the word error.",
   "C": "A Logs Insights query saved to a dashboard and reviewed each morning.",
   "D": "Increasing the log group retention so more history is available for comparison."
  },
  "answer": [
   "A"
  ],
  "explanation": "Logs anomaly detection builds a model of the recurring patterns in a log group's content and flags patterns that are new or whose frequency deviates from the learned baseline, which is what detecting a previously unseen error signature requires without enumerating messages in advance. Option B catches only the messages someone thought to match and generates constant noise from routine errors. Option C is a manual daily review, so detection depends on someone reading it and noticing something unfamiliar. Option D keeps more data without analysing any of it."
 },
 {
  "id": "dop-207",
  "source": "authored",
  "domain": 5,
  "topic": "Scheduling automation",
  "difficulty": "medium",
  "multi": false,
  "question": "A team needs several thousand one-off scheduled invocations, each at a customer-specific time, with the ability to create and cancel them programmatically. Which service fits best?",
  "choices": {
   "A": "Amazon EventBridge Scheduler, which supports millions of one-time and recurring schedules created through an API, each with its own target, flexible time window and retry policy.",
   "B": "Amazon EventBridge rules with cron expressions, one rule per customer schedule.",
   "C": "A CloudWatch alarm per customer configured to fire at the required time.",
   "D": "A Lambda function invoked every minute that scans a table for due items."
  },
  "answer": [
   "A"
  ],
  "explanation": "EventBridge Scheduler is built for large numbers of individually managed schedules: it supports one-time and recurring schedules at very high cardinality, each created, updated and deleted through the API with its own target, retry policy and optional flexible time window. Option B runs into the account quota on rules and treats a per-customer schedule as infrastructure to be managed rather than data. Option C misuses alarms, which evaluate metrics rather than fire at appointed times. Option D is a workable pattern but adds a table, a polling function and its own failure modes, with a minimum granularity of the poll interval."
 },
 {
  "id": "dop-208",
  "source": "authored",
  "domain": 5,
  "topic": "Runbook versus automation decision",
  "difficulty": "medium",
  "multi": false,
  "question": "An operational task is performed manually about twice a week, takes fifteen minutes, and has caused two outages in six months because of steps being missed. Which response is most appropriate?",
  "choices": {
   "A": "Automate the task as a Systems Manager Automation runbook so it executes identically each time, with the execution history providing an audit trail, and trigger it from the condition that currently prompts the manual work.",
   "B": "Write a more detailed wiki page describing the steps and require engineers to follow it carefully.",
   "C": "Restrict the task to two senior engineers who are less likely to make mistakes.",
   "D": "Add a peer review requirement so a second engineer watches each execution."
  },
  "answer": [
   "A"
  ],
  "explanation": "A task that is frequent, well understood and has a track record of human error from missed steps is the clearest possible candidate for automation: encoding it as a runbook removes the variability, and the execution history records what ran and when. Option B is the control that has already failed, since documentation does not prevent skipped steps under pressure. Option C creates a bottleneck and a single point of knowledge without removing the error mode. Option D doubles the cost of every execution and relies on human vigilance, which degrades with repetition."
 },
 {
  "id": "dop-209",
  "source": "authored",
  "domain": 6,
  "topic": "OIDC federation for CI",
  "difficulty": "hard",
  "multi": false,
  "question": "A team runs builds in GitHub Actions and currently stores long-lived IAM access keys as repository secrets to deploy to AWS. Security wants the static credentials removed. What should be implemented?",
  "choices": {
   "A": "Create an IAM OIDC identity provider for the GitHub Actions token issuer and a role whose trust policy conditions on the repository and branch claims, so workflows exchange a short-lived OIDC token for temporary credentials.",
   "B": "Rotate the IAM access keys automatically every 24 hours with a Lambda function that updates the repository secret.",
   "C": "Create an IAM user per repository with a permission boundary limiting its actions.",
   "D": "Store the access keys in AWS Secrets Manager and have the workflow retrieve them at run time."
  },
  "answer": [
   "A"
  ],
  "explanation": "OIDC federation removes static credentials entirely: AWS trusts GitHub's token issuer, the role's trust policy conditions on subject claims so only the intended repository, branch or environment may assume it, and each workflow run receives short-lived credentials from STS. Option B keeps long-lived keys in existence and adds a rotation system that itself holds powerful permissions. Option C still issues static access keys, merely scoping what they can do. Option D is circular, since the workflow needs AWS credentials to read the secret in the first place."
 },
 {
  "id": "dop-210",
  "source": "authored",
  "domain": 6,
  "topic": "Permission boundaries",
  "difficulty": "hard",
  "multi": false,
  "question": "A platform team wants developers to create IAM roles for their own applications, but must guarantee those roles can never exceed a defined set of permissions, and that developers cannot escape the restriction by creating a role without it. Which combination achieves this?",
  "choices": {
   "A": "Grant developers iam:CreateRole and iam:PutRolePolicy with a condition requiring that a specific permission boundary policy is attached, and deny changes to or deletion of that boundary policy.",
   "B": "Attach the maximum permission set as a managed policy to every developer-created role.",
   "C": "Apply an SCP to the account denying the specific actions developers must not use.",
   "D": "Require developers to raise a ticket for the platform team to create each role."
  },
  "answer": [
   "A"
  ],
  "explanation": "Permission boundaries cap the effective permissions of a principal to the intersection of its policies and the boundary, and the IAM condition keys iam:PermissionsBoundary let you require that a boundary is attached at role creation, which closes the escape route of creating an unbounded role. Denying modification of the boundary policy itself completes the control. Option B sets the permissions rather than capping them and does nothing to stop a developer attaching more. Option C is a valuable additional layer but SCPs restrict the whole account uniformly and cannot express per-role delegation limits. Option D removes the self-service capability the requirement is preserving."
 },
 {
  "id": "dop-211",
  "source": "authored",
  "domain": 6,
  "topic": "Secrets rotation",
  "difficulty": "medium",
  "multi": false,
  "question": "A database credential in AWS Secrets Manager must be rotated every 30 days with no application downtime. Which rotation strategy is recommended for a credential shared by many application instances?",
  "choices": {
   "A": "The alternating users strategy, in which two database users are maintained and rotation updates the inactive one before switching the secret to it, so a valid credential is always available.",
   "B": "The single user strategy, in which the password of the one database user is changed in place during the rotation window.",
   "C": "Disabling rotation and changing the password manually during a scheduled maintenance window.",
   "D": "Rotating the secret every 30 days and restarting all application instances immediately afterwards."
  },
  "answer": [
   "A"
  ],
  "explanation": "With the alternating users strategy Secrets Manager maintains two users and rotates by updating the credentials of the one not currently in use, then promoting it, so at every instant there is a valid credential that clients can retrieve — which is why AWS recommends it for workloads that cannot tolerate a window where the cached credential is invalid. Option B changes the single user's password in place, so clients holding the old value fail until they refetch. Option C reintroduces the manual process and downtime the requirement excludes. Option D causes a deliberate disruption on every rotation and does not address clients that fail between the rotation and the restart."
 },
 {
  "id": "dop-212",
  "source": "authored",
  "domain": 6,
  "topic": "Detecting overly permissive access",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team must identify IAM roles and resource policies that grant access to principals outside the organisation, and must generate least-privilege policies based on what roles have actually used. Which service provides both?",
  "choices": {
   "A": "AWS IAM Access Analyzer, whose external access analyzers identify resources shared outside the zone of trust and whose policy generation feature produces policies from CloudTrail activity.",
   "B": "AWS Config with the iam-policy-no-statements-with-admin-access managed rule.",
   "C": "AWS Trusted Advisor security checks.",
   "D": "Amazon Inspector network reachability findings."
  },
  "answer": [
   "A"
  ],
  "explanation": "IAM Access Analyzer covers both halves: an external access analyzer uses automated reasoning over resource policies to report access granted to principals outside the defined zone of trust, and policy generation reads CloudTrail history for a role and produces a policy scoped to the actions actually used. Option B flags a specific pattern of overly broad statements but performs no external access analysis and generates no policies. Option C offers a fixed set of security checks without either capability. Option D analyses network paths to instances rather than IAM permissions."
 },
 {
  "id": "dop-213",
  "source": "authored",
  "domain": 6,
  "topic": "Preventive guardrails",
  "difficulty": "medium",
  "multi": true,
  "question": "An organisation must guarantee that member accounts cannot disable CloudTrail logging or delete the central log bucket, even by an account administrator. Which TWO controls enforce this?",
  "choices": {
   "A": "A service control policy denying cloudtrail:StopLogging, cloudtrail:DeleteTrail and cloudtrail:UpdateTrail on the organisation trail for all member accounts.",
   "B": "An S3 bucket policy on the central log bucket denying delete actions from any principal outside the log archive account.",
   "C": "An IAM policy attached to each administrator role in the member accounts denying the CloudTrail actions.",
   "D": "Enabling MFA delete on the log bucket so deletions require a hardware token.",
   "E": "An AWS Config rule that detects when CloudTrail has been disabled and notifies the security team."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "SCPs apply to every principal in a member account including its administrators and the account root user, so denying the CloudTrail mutation actions makes disabling logging impossible from within the account. The bucket lives in a separate log archive account, and a bucket policy denying deletes from outside that account protects the stored logs. Option C is insufficient because an account administrator can detach or modify an IAM policy. Option D is a useful control for versioned buckets but applies to the root user of the bucket-owning account and does not address the CloudTrail configuration. Option E detects the problem after it has happened rather than preventing it."
 },
 {
  "id": "dop-214",
  "source": "authored",
  "domain": 6,
  "topic": "Pipeline least privilege",
  "difficulty": "hard",
  "multi": false,
  "question": "A CodeBuild project's service role currently has the AdministratorAccess policy attached because nobody knows which permissions the build needs. What is the most effective way to reduce it to least privilege?",
  "choices": {
   "A": "Run the build with the broad role for a representative period, then use IAM Access Analyzer policy generation on the role's CloudTrail history to produce a scoped policy, review it, and replace the broad policy.",
   "B": "Replace the policy with PowerUserAccess, which excludes IAM actions and is therefore least privilege.",
   "C": "Remove permissions one at a time and rerun the build until it fails, then add the last one back.",
   "D": "Attach a permission boundary with AdministratorAccess so the role's effective permissions are capped."
  },
  "answer": [
   "A"
  ],
  "explanation": "Policy generation reads the role's recorded CloudTrail activity over a chosen window and emits a policy containing the services and actions actually used, which turns an unknown requirement into a concrete starting point for review — the fastest reliable path from a broad policy to a scoped one. Option B is a smaller grant but still far broader than the build needs and is not least privilege in any meaningful sense. Option C is a slow trial-and-error loop that misses permissions used only on infrequent code paths. Option D caps at administrator, which is no cap at all."
 },
 {
  "id": "dop-215",
  "source": "authored",
  "domain": 6,
  "topic": "Container image provenance",
  "difficulty": "hard",
  "multi": false,
  "question": "A company must ensure that only container images built by its own pipeline can be deployed to production, and that a tampered image is rejected at deployment time. Which approach provides this guarantee?",
  "choices": {
   "A": "Sign images in the pipeline with a signing key managed in AWS, and verify the signature at deployment with an admission control policy that rejects unsigned or invalid images.",
   "B": "Restrict the production ECR repository so only the pipeline role holds ecr:PutImage permission.",
   "C": "Enable ECR enhanced scanning so vulnerable images are flagged before deployment.",
   "D": "Use immutable tags on the production repository so an image tag cannot be overwritten."
  },
  "answer": [
   "A"
  ],
  "explanation": "Only cryptographic signing plus verification at deployment gives the end-to-end guarantee described, because the check is performed against the image itself at the moment of deployment rather than depending on the integrity of every intermediate control. Options B and D are both genuinely valuable and belong in the design — restricting push permission limits who can publish, and immutable tags prevent a tag being repointed at different content — but neither detects a tampered image at deployment, and both rely on the registry's access controls never being bypassed. Option C addresses known vulnerabilities, which is a different property from provenance and integrity."
 },
 {
  "id": "dop-216",
  "source": "authored",
  "domain": 6,
  "topic": "Secrets in source control",
  "difficulty": "medium",
  "multi": false,
  "question": "An engineer accidentally committed an AWS access key to a repository. Beyond removing the commit, what is the essential immediate action and the appropriate preventive control?",
  "choices": {
   "A": "Deactivate and delete the exposed key immediately because it must be assumed compromised, and add automated secret scanning to the repository and pipeline to block future commits containing credentials.",
   "B": "Rewrite the git history to remove the commit, which fully resolves the exposure since the key is no longer retrievable.",
   "C": "Restrict the key with an IP-based condition so it can only be used from the corporate network.",
   "D": "Rotate the key on its normal 90-day schedule and monitor CloudTrail for unusual activity in the meantime."
  },
  "answer": [
   "A"
  ],
  "explanation": "Once a credential has been committed it must be treated as compromised regardless of what happens next, because clones, forks, caches and automated scrapers may already hold it, so revocation is the only reliable response; secret scanning then prevents recurrence by catching credentials before they land. Option B is insufficient on its own, since history rewriting does not reach copies that already exist elsewhere. Option C narrows but does not remove the exposure and fails as soon as an attacker has any path through the permitted range. Option D leaves a known-compromised credential valid for up to 90 days."
 },
 {
  "id": "dop-217",
  "source": "authored",
  "domain": 6,
  "topic": "KMS key policies",
  "difficulty": "hard",
  "multi": false,
  "question": "A pipeline role in the tooling account cannot decrypt objects encrypted with a customer managed KMS key in the same account, even though its IAM policy allows kms:Decrypt on that key ARN. What is the most likely cause?",
  "choices": {
   "A": "The key policy does not grant access to the role and does not delegate authorisation to IAM policies, so the IAM grant alone is insufficient.",
   "B": "The key is in a different Region from the pipeline, so the ARN cannot be resolved.",
   "C": "The role is missing the kms:GenerateDataKey permission, which is required before Decrypt can be called.",
   "D": "Key rotation is enabled, so the previous key material can no longer decrypt existing objects."
  },
  "answer": [
   "A"
  ],
  "explanation": "KMS authorisation is unusual in that the key policy is primary: unless the key policy grants access to the principal, or contains the statement that delegates to IAM by allowing the account root with kms:CallerAccount-style trust, an IAM policy allowing kms:Decrypt has no effect. Adding the role to the key policy resolves it. Option B would produce a different error and the question states the key is in the same account and context. Option C is wrong because GenerateDataKey is used when encrypting, and Decrypt does not depend on it. Option D misstates automatic rotation, which retains all previous key material so older ciphertext remains decryptable."
 },
 {
  "id": "dop-218",
  "source": "authored",
  "domain": 6,
  "topic": "Compliance evidence collection",
  "difficulty": "medium",
  "multi": false,
  "question": "An organisation must produce evidence for an annual audit showing continuous compliance with a control framework, mapped to specific controls, without engineers assembling screenshots by hand. Which service is designed for this?",
  "choices": {
   "A": "AWS Audit Manager, which maps AWS data sources to framework controls and continuously collects evidence into assessment reports.",
   "B": "AWS Security Hub, which aggregates findings and reports on security standard compliance scores.",
   "C": "AWS Config, which records resource configuration history and rule compliance.",
   "D": "AWS Artifact, which provides AWS compliance reports and agreements on demand."
  },
  "answer": [
   "A"
  ],
  "explanation": "Audit Manager is purpose-built for audit preparation: prebuilt and custom frameworks map controls to AWS data sources such as CloudTrail, Config and Security Hub, evidence is collected continuously against each control, and assessment reports are generated for auditors. Option B reports current security posture against standards but does not assemble time-based evidence mapped to an arbitrary control framework. Option C supplies much of the underlying evidence but leaves the control mapping and report assembly as manual work. Option D provides AWS's own compliance artefacts about its infrastructure, not evidence about the customer's workloads."
 },
 {
  "id": "dop-219",
  "source": "authored",
  "domain": 6,
  "topic": "IAM roles for service accounts",
  "difficulty": "hard",
  "multi": false,
  "question": "Pods in an Amazon EKS cluster currently use the worker node instance role to access S3, which means every pod on a node inherits the same permissions. The team wants per-workload permissions. What should be implemented?",
  "choices": {
   "A": "IAM roles for service accounts, associating an IAM role with a Kubernetes service account through the cluster OIDC provider so each pod receives credentials scoped to its own role.",
   "B": "A separate node group per workload, each with its own instance role, and node selectors to place pods appropriately.",
   "C": "Kubernetes secrets containing IAM access keys, mounted into each pod.",
   "D": "Network policies restricting which pods can reach the EC2 instance metadata service."
  },
  "answer": [
   "A"
  ],
  "explanation": "IAM roles for service accounts uses the cluster's OIDC identity provider to exchange a projected service account token for temporary AWS credentials, so permissions are bound to the Kubernetes service account a pod runs under rather than to the node. That gives per-workload least privilege without changing where pods are scheduled. Option B achieves isolation at considerable cost in node sprawl and scheduling complexity, and still grants node-level permissions. Option C stores long-lived credentials in the cluster, which is the practice IRSA exists to eliminate. Option D is a useful hardening measure to stop metadata access but grants no per-workload identity of its own."
 },
 {
  "id": "dop-220",
  "source": "authored",
  "domain": 6,
  "topic": "Attribute-based access control",
  "difficulty": "hard",
  "multi": false,
  "question": "An organisation has hundreds of project teams and does not want to create a new IAM policy every time a project is added. Engineers should be able to manage only resources belonging to their own project. Which approach scales best?",
  "choices": {
   "A": "Attribute-based access control, using a single policy whose conditions compare a principal tag such as project against the matching resource tag, so new projects need no policy changes.",
   "B": "A separate IAM policy per project, generated automatically by a pipeline when a project is created.",
   "C": "A separate AWS account per project, with cross-account roles for shared services.",
   "D": "IAM groups per project, with engineers added to the appropriate group."
  },
  "answer": [
   "A"
  ],
  "explanation": "ABAC expresses the rule once — the principal's project tag must equal the resource's project tag — so onboarding a project means tagging identities and resources rather than authoring policy, which is what makes it scale to hundreds of teams. Option B automates policy sprawl rather than avoiding it, and every account has policy size and count quotas. Option C provides the strongest isolation and is a legitimate design, but it is a far larger organisational change than the access control problem requires. Option D still needs a distinct policy per group describing that project's resources, so the underlying growth remains."
 },
 {
  "id": "dop-221",
  "source": "authored",
  "domain": 6,
  "topic": "VPC endpoint policies",
  "difficulty": "hard",
  "multi": true,
  "question": "A regulated workload must ensure that EC2 instances can reach only the company's own S3 buckets, and that data cannot be copied to buckets in other AWS accounts. Which TWO controls enforce this?",
  "choices": {
   "A": "A VPC endpoint policy on the S3 gateway endpoint that allows access only to the company's bucket ARNs.",
   "B": "An SCP or IAM policy using the aws:ResourceOrgID condition key to deny S3 access to buckets outside the organisation.",
   "C": "A security group rule restricting outbound traffic to the S3 prefix list, which limits access to approved buckets.",
   "D": "S3 Block Public Access enabled on the company's own buckets.",
   "E": "A network ACL denying outbound HTTPS traffic from the private subnets."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Two layers are needed because each covers a gap in the other. An endpoint policy constrains what can be reached through that endpoint, so requests to other accounts' buckets over the endpoint are denied. A policy using aws:ResourceOrgID denies access to any bucket outside the organisation regardless of the network path taken, which covers routes that do not traverse the endpoint. Option C is wrong because the S3 prefix list identifies the service's addresses, not particular buckets, so all buckets remain reachable. Option D governs public access to your own buckets and says nothing about writing to someone else's. Option E blocks legitimate S3 traffic along with everything else."
 },
 {
  "id": "dop-222",
  "source": "authored",
  "domain": 6,
  "topic": "Organisation-wide threat detection",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team wants Amazon GuardDuty enabled in every account and Region of the organisation, including accounts created later, managed from a single security account. What should they configure?",
  "choices": {
   "A": "Designate the security account as the GuardDuty delegated administrator for the organisation and enable auto-enable for new accounts and for the required Regions.",
   "B": "Enable GuardDuty manually in each account and invite them to the security account as members.",
   "C": "Create a StackSet that enables GuardDuty in each account and re-run it monthly to catch new accounts.",
   "D": "Enable GuardDuty in the management account only, since findings from member accounts aggregate automatically."
  },
  "answer": [
   "A"
  ],
  "explanation": "GuardDuty integrates with AWS Organizations through a delegated administrator, which centralises configuration and findings in the security account and provides an auto-enable setting so accounts joining the organisation are protected automatically without any per-account action. Option B works but requires manual invitation and acceptance for every account, including future ones. Option C automates enablement but couples coverage to a monthly run, leaving a window in which new accounts are unmonitored, and duplicates a native feature. Option D is wrong, since enabling the service in one account does not extend detection to others."
 },
 {
  "id": "dop-223",
  "source": "authored",
  "domain": 6,
  "topic": "Vulnerability management",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must continuously assess EC2 instances and container images for known software vulnerabilities, with findings appearing automatically as new CVEs are published, and without installing a separate scanning agent beyond the SSM Agent. Which service should be used?",
  "choices": {
   "A": "Amazon Inspector, which continuously scans EC2 instances through the SSM Agent and ECR images, and re-evaluates existing inventory when new vulnerabilities are published.",
   "B": "Amazon GuardDuty, which analyses CloudTrail, DNS and VPC Flow Logs for malicious activity.",
   "C": "AWS Systems Manager Patch Manager, which reports which patches are missing against a baseline.",
   "D": "AWS Security Hub, which aggregates findings from other services into a single view."
  },
  "answer": [
   "A"
  ],
  "explanation": "Inspector performs continuous vulnerability assessment: it uses the SSM Agent to inventory software on EC2 instances, scans container images in ECR, and rescans existing inventory automatically when new CVEs are published so findings appear without a scheduled scan. Option B detects active threats from log analysis rather than assessing software for known vulnerabilities. Option C reports patch compliance against an approval baseline, which is related but expresses missing patches rather than CVE exposure and does not cover container images. Option D consolidates findings produced by services like Inspector but generates no vulnerability findings itself."
 },
 {
  "id": "dop-224",
  "source": "authored",
  "domain": 6,
  "topic": "Certificate lifecycle",
  "difficulty": "medium",
  "multi": false,
  "question": "A public TLS certificate on an Application Load Balancer expired, causing an outage. The team wants renewal to happen automatically in future. What should they do?",
  "choices": {
   "A": "Issue the certificate from AWS Certificate Manager with DNS validation using a Route 53 hosted zone, so ACM renews it automatically as long as the validation record remains in place.",
   "B": "Import the existing certificate into ACM and enable automatic renewal on the imported certificate.",
   "C": "Set a CloudWatch alarm on the DaysToExpiry metric so an engineer renews the certificate before it expires.",
   "D": "Issue a certificate with a ten-year validity period from a public certificate authority."
  },
  "answer": [
   "A"
  ],
  "explanation": "ACM-issued public certificates used with integrated services renew automatically, and DNS validation makes that renewal fully hands-off because the CNAME record stays in the hosted zone and ACM revalidates against it without human action. Option B is the trap: imported certificates are never renewed by ACM, and the customer remains responsible for reimporting before expiry. Option C keeps the manual renewal step and merely warns about it. Option D is not possible, since public certificate authorities issue certificates with validity periods measured in months."
 },
 {
  "id": "dop-225",
  "source": "authored",
  "domain": 6,
  "topic": "Root user protection",
  "difficulty": "medium",
  "multi": true,
  "question": "An organisation must minimise the risk associated with member account root users. Which TWO controls are recommended?",
  "choices": {
   "A": "Apply an SCP that denies all actions when the principal is the account root user, with a narrow exception set for the tasks that genuinely require root.",
   "B": "Enable multi-factor authentication on every root user and store the credentials and MFA device securely for break-glass use only.",
   "C": "Create long-lived access keys for each root user and store them in Secrets Manager so automation can use them.",
   "D": "Delete the root user from each member account so it cannot be used.",
   "E": "Attach a permission boundary to the root user limiting its effective permissions."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "SCPs are the only policy type that constrains the root user of a member account, so denying root actions except for the handful of tasks that require it is the principal preventive control. Protecting the credentials themselves with MFA and treating them as break-glass covers the remaining legitimate uses. Option C is the opposite of best practice — root access keys should not exist, and automation should use roles. Option D is not possible, since the root user is intrinsic to an account and cannot be deleted. Option E does not apply, because permission boundaries attach to IAM users and roles, not to the account root."
 },
 {
  "id": "dop-226",
  "source": "authored",
  "domain": 6,
  "topic": "Encryption in transit enforcement",
  "difficulty": "medium",
  "multi": false,
  "question": "An auditor requires proof that no object can be read from or written to a sensitive S3 bucket over an unencrypted connection. What should be configured?",
  "choices": {
   "A": "A bucket policy denying all actions when the aws:SecureTransport condition key is false, so plain HTTP requests are rejected.",
   "B": "Default encryption on the bucket using SSE-KMS, which encrypts objects in transit and at rest.",
   "C": "A VPC endpoint for S3, so traffic stays on the AWS network and does not require TLS.",
   "D": "S3 Block Public Access, which prevents anonymous unencrypted requests."
  },
  "answer": [
   "A"
  ],
  "explanation": "The aws:SecureTransport condition key is true only when the request arrives over TLS, so a bucket policy with a Deny on all actions when it is false makes unencrypted access impossible and provides a clear, auditable statement of the control. Option B conflates two different properties: default encryption protects data at rest and has no effect on the transport used. Option C keeps traffic off the public internet but does not enforce TLS, and private network paths do not satisfy an encryption-in-transit requirement. Option D blocks public access configurations, which is unrelated to whether a request uses TLS."
 },
 {
  "id": "dop-227",
  "source": "authored",
  "domain": 6,
  "topic": "Patch compliance reporting",
  "difficulty": "medium",
  "multi": false,
  "question": "A compliance team must show that 95% of production instances have all critical patches applied within 30 days of release, reported centrally across accounts. Which combination provides this?",
  "choices": {
   "A": "Systems Manager Patch Manager with patch policies applied across the organisation, and patch compliance data aggregated with Systems Manager Explorer or a Config aggregator for central reporting.",
   "B": "Amazon Inspector findings exported to S3 and summarised with Athena.",
   "C": "A monthly Run Command invocation that installs updates and writes results to a log group.",
   "D": "AWS Trusted Advisor security checks reviewed each month."
  },
  "answer": [
   "A"
  ],
  "explanation": "Patch Manager both applies patches according to a baseline and records per-instance patch compliance, and patch policies deployed through Organizations extend this across accounts, with Explorer or a Config aggregator giving the central rollup the compliance team needs. Option B reports vulnerabilities rather than patch compliance against an approval baseline, so it does not directly answer the 30-day question. Option C patches but records only free-form log output, which is not a compliance dataset and covers a single account. Option D provides generic best-practice checks with no patch compliance data."
 },
 {
  "id": "dop-228",
  "source": "authored",
  "domain": 6,
  "topic": "Code signing for Lambda",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must guarantee that Lambda functions in production run only code packages that were signed by its own release process, with unsigned or altered packages rejected on deployment. What should be configured?",
  "choices": {
   "A": "An AWS Signer signing profile used by the pipeline to sign deployment packages, and a code signing configuration attached to the functions that rejects packages failing signature validation.",
   "B": "An S3 bucket policy allowing only the pipeline role to write deployment packages to the artifact bucket.",
   "C": "A checksum recorded in a DynamoDB table and verified by a Lambda layer at runtime.",
   "D": "Immutable versions and aliases so a published version cannot be modified."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Signer produces signed Lambda deployment packages, and a code signing configuration attached to a function tells Lambda to validate the signature against trusted signing profiles and to reject the deployment if the signature is missing, expired or the package has been altered. That is enforcement by the service at deployment. Option B controls who may write artifacts but does not verify the code Lambda actually receives. Option C validates after the code is already running, which is too late and depends on the untrusted code cooperating. Option D prevents a published version from changing but does nothing to establish who produced it."
 },
 {
  "id": "dop-229",
  "source": "authored",
  "domain": 6,
  "topic": "Dependency and supply chain scanning",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team wants the build to fail when an application dependency has a known critical vulnerability, and wants a record of every component shipped in each release. Which pipeline additions meet this?",
  "choices": {
   "A": "A dependency scanning step that fails the build on critical findings, and generation of a software bill of materials stored alongside the release artifact.",
   "B": "Amazon Inspector scanning of the running EC2 instances after deployment.",
   "C": "A manual security review of the dependency manifest before each release.",
   "D": "ECR enhanced scanning of the container image after it is pushed, with findings emailed to the team."
  },
  "answer": [
   "A"
  ],
  "explanation": "The requirement has a gate and an inventory. Failing the build on critical findings puts the gate before the artifact exists, and generating and retaining a software bill of materials with the release gives the per-release component record needed to answer later questions such as which releases contained a newly disclosed vulnerable library. Option B finds problems only after the vulnerable code is running in an environment. Option C is manual, inconsistent and does not scale to frequent releases. Option D scans at the right layer but after the push, and emailing findings is not a gate, so a vulnerable image remains deployable."
 },
 {
  "id": "dop-230",
  "source": "authored",
  "domain": 6,
  "topic": "Cross-account trust design",
  "difficulty": "hard",
  "multi": false,
  "question": "A third-party vendor needs read-only access to a customer's account. What is the recommended way to grant it while preventing the confused deputy problem?",
  "choices": {
   "A": "Create a role that the vendor's account can assume, with a trust policy requiring a unique external ID agreed with the vendor and a read-only permission policy.",
   "B": "Create an IAM user for the vendor with read-only permissions and send them the access keys over an encrypted channel.",
   "C": "Add the vendor's AWS account as a principal on each resource policy in the account.",
   "D": "Create a role that any AWS principal can assume, with a permission policy restricted to read-only actions."
  },
  "answer": [
   "A"
  ],
  "explanation": "The external ID exists precisely to prevent the confused deputy problem: because the vendor must present a value unique to this customer when assuming the role, another of the vendor's customers cannot induce the vendor to act against this account. Combined with a role rather than a user, credentials are temporary and revocation is immediate. Option B issues long-lived credentials outside the customer's control. Option C requires a resource policy on every resource type and many do not support them, so coverage is incomplete. Option D is a serious misconfiguration: a wildcard principal lets anyone assume the role, and read-only access to a customer's account is still a significant disclosure."
 },
 {
  "id": "dop-231",
  "source": "authored",
  "domain": 6,
  "topic": "Break-glass access",
  "difficulty": "medium",
  "multi": false,
  "question": "A team needs an emergency access path for severe incidents when the normal identity provider is unavailable, without leaving standing privileged access in place. Which design is appropriate?",
  "choices": {
   "A": "A rarely used break-glass role with elevated permissions, protected by MFA, whose assumption raises an immediate high-priority alert and is reviewed after every use.",
   "B": "Permanent administrator permissions for the two most senior engineers so they can always respond.",
   "C": "A shared IAM user whose password is kept in a team password manager.",
   "D": "An SCP that grants administrator access to any principal during a declared incident."
  },
  "answer": [
   "A"
  ],
  "explanation": "Break-glass access is characterised by being available but conspicuous: the elevated role exists and can be assumed without the normal identity provider, but every assumption generates an alert and a review, so the privilege is not standing and its use is never silent. Option B creates permanently privileged accounts, which is the standing access the requirement rules out. Option C uses a shared credential, destroying attribution and making rotation after each use unlikely. Option D misunderstands SCPs, which can only restrict permissions rather than grant them, and there is no mechanism for them to respond to a declared incident."
 },
 {
  "id": "dop-232",
  "source": "authored",
  "domain": 6,
  "topic": "Data classification",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must discover whether personally identifiable information has been stored in any of its S3 buckets, and be alerted when new sensitive data appears. Which service provides this?",
  "choices": {
   "A": "Amazon Macie, which discovers and classifies sensitive data in S3 using managed and custom data identifiers and generates findings.",
   "B": "Amazon Inspector, which scans workloads for software vulnerabilities.",
   "C": "AWS Glue crawlers, which infer schemas from data in S3 and populate the Data Catalog.",
   "D": "AWS Config, which records the configuration of S3 buckets over time."
  },
  "answer": [
   "A"
  ],
  "explanation": "Macie is the sensitive data discovery service for S3: managed data identifiers detect common categories such as names, addresses, credentials and financial identifiers, custom identifiers extend that with organisation-specific patterns, and jobs can run continuously so newly stored sensitive data produces findings. Option B assesses software vulnerabilities and has no data classification capability. Option C infers structure to enable analytics and makes no judgement about sensitivity. Option D records bucket configuration such as encryption and access settings rather than examining object contents."
 },
 {
  "id": "dop-233",
  "source": "authored",
  "domain": 6,
  "topic": "Least privilege for deployment roles",
  "difficulty": "hard",
  "multi": false,
  "question": "A CodePipeline CloudFormation action currently runs with the pipeline's own broad role. The team wants CloudFormation to create resources under a tightly scoped identity, separate from the permissions the pipeline itself needs. What should be configured?",
  "choices": {
   "A": "A CloudFormation service role specified on the deploy action, so CloudFormation assumes that role to create and modify resources, while the pipeline role needs only permission to pass it and to call CloudFormation.",
   "B": "A permission boundary attached to the pipeline role limiting which resources it can create.",
   "C": "A stack policy on the target stack restricting which resources may be updated.",
   "D": "A separate pipeline for each resource type, each with a narrowly scoped role."
  },
  "answer": [
   "A"
  ],
  "explanation": "Specifying a CloudFormation service role separates two identities: CloudFormation performs all resource operations under the scoped service role, and the pipeline role is reduced to calling CloudFormation and passing that role, guarded by iam:PassRole. This is the recommended way to keep deployment permissions out of the pipeline identity. Option B caps the pipeline role but still leaves resource creation happening under it. Option C constrains updates to an existing stack's resources rather than defining the identity used to perform them. Option D multiplies pipelines without addressing which identity creates resources."
 },
 {
  "id": "dop-234",
  "source": "authored",
  "domain": 6,
  "topic": "Security standards automation",
  "difficulty": "medium",
  "multi": true,
  "question": "An organisation wants continuous, automated checks against a recognised security benchmark across all accounts, with a single prioritised view of failures. Which TWO steps accomplish this?",
  "choices": {
   "A": "Enable AWS Security Hub with a delegated administrator for the organisation and auto-enable for new accounts.",
   "B": "Enable a security standard such as the AWS Foundational Security Best Practices or CIS benchmark in Security Hub, whose controls are evaluated continuously.",
   "C": "Create a CloudWatch dashboard with one widget per account showing security group counts.",
   "D": "Run a quarterly manual review against the benchmark checklist and record exceptions in a spreadsheet.",
   "E": "Enable CloudTrail Insights so unusual API activity is treated as a benchmark failure."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Security Hub with an organisation delegated administrator aggregates findings from every account into one place and auto-enables new accounts, and enabling a standard turns on the benchmark's controls, which are evaluated continuously with per-control status and a compliance score. Together these give the automated checks and the single prioritised view. Option C shows unrelated counts and encodes no benchmark. Option D is the manual process being replaced and is neither continuous nor automated. Option E detects unusual API call volume, which is a different signal and is not a benchmark evaluation."
 },
 {
  "id": "dop-235",
  "source": "authored",
  "domain": 6,
  "topic": "ECS task and execution roles",
  "difficulty": "hard",
  "multi": false,
  "question": "An ECS task must pull an image from a private ECR repository, read a secret at start-up, and call DynamoDB from application code. Which role assignment is correct?",
  "choices": {
   "A": "The task execution role needs ECR pull and secret read permissions because the ECS agent uses it to start the task, and the task role needs the DynamoDB permissions because the application code assumes it.",
   "B": "The task role needs all three permissions, since it is the identity the task runs under.",
   "C": "The task execution role needs all three permissions, since it is used for everything ECS does on behalf of the task.",
   "D": "The container instance role needs the ECR and secret permissions, and the task role needs the DynamoDB permissions."
  },
  "answer": [
   "A"
  ],
  "explanation": "ECS uses two distinct roles. The task execution role belongs to the ECS agent and is used for infrastructure-level actions taken to launch the task — pulling the image from ECR, retrieving values referenced under the secrets key, and writing container logs. The task role is assumed by the application code inside the container through the task metadata endpoint, so it carries the permissions the application itself needs, such as DynamoDB access. Options B and C each collapse the two roles, granting the application more than it needs or leaving the agent unable to start the task. Option D applies to EC2 launch type only and is discouraged, since node-level permissions are shared by every task on the instance."
 },
 {
  "id": "dop-236",
  "source": "authored",
  "domain": 6,
  "topic": "Policy evaluation logic",
  "difficulty": "hard",
  "multi": false,
  "question": "A developer's role has an identity policy allowing s3:DeleteObject on a bucket, but the call is denied. An SCP on the account allows the action, and the bucket policy is silent on the principal. What is the most likely explanation?",
  "choices": {
   "A": "A permission boundary or session policy attached to the role does not allow the action, and effective permissions are the intersection of the identity policy with every applicable boundary.",
   "B": "The bucket policy must explicitly allow the principal, because a resource policy silent on a principal denies access within the same account.",
   "C": "The SCP allows the action but SCPs must also be attached to the role directly to take effect.",
   "D": "The identity policy is overridden by the account default, which denies all delete actions."
  },
  "answer": [
   "A"
  ],
  "explanation": "Evaluation combines several policy types, and permission boundaries and session policies act as ceilings: an action must be allowed by the identity policy and by every boundary that applies, so a boundary omitting s3:DeleteObject produces an implicit deny even though the identity policy allows it. Option B misstates cross-policy evaluation within a single account, where an allow in the identity policy is sufficient and a silent resource policy is not a deny. Option C is wrong because SCPs attach to organisational units and accounts, never to roles. Option D invents an account default deny; there is no such construct beyond the ordinary implicit deny."
 },
 {
  "id": "dop-237",
  "source": "authored",
  "domain": 6,
  "topic": "Immutable audit storage",
  "difficulty": "medium",
  "multi": false,
  "question": "A regulator requires that CloudTrail logs cannot be deleted or altered for seven years, even by the account that owns the log bucket. What should be configured?",
  "choices": {
   "A": "S3 Object Lock in compliance mode with a seven-year retention period on the versioned log bucket, so no principal can delete or overwrite the objects before the period expires.",
   "B": "S3 Object Lock in governance mode with a seven-year retention period, so only users with special permissions can remove the lock.",
   "C": "A lifecycle rule transitioning logs to S3 Glacier Deep Archive after 30 days with a seven-year expiry.",
   "D": "Versioning with MFA delete enabled on the log bucket."
  },
  "answer": [
   "A"
  ],
  "explanation": "Compliance mode is the setting that satisfies a true write-once requirement: once applied, the retention period cannot be shortened and the object version cannot be deleted or overwritten by any user, including the root user of the owning account, until the period expires. Option B is deliberately weaker, since governance mode can be overridden by principals holding the bypass permission, which does not meet the stated requirement. Option C changes storage class and cost, and an expiry rule deletes rather than protects. Option D raises the bar for deletion but the root user with an MFA device can still remove versions, so it is not immutability."
 },
 {
  "id": "dop-238",
  "source": "authored",
  "domain": 6,
  "topic": "Credential hygiene reporting",
  "difficulty": "easy",
  "multi": false,
  "question": "A security team must identify IAM users with access keys older than 90 days, users without MFA, and unused credentials across an account. Which is the most direct source?",
  "choices": {
   "A": "The IAM credential report, a downloadable CSV listing every user with the age and last-used date of their passwords and access keys and their MFA status.",
   "B": "CloudTrail events filtered to the iam.amazonaws.com event source.",
   "C": "AWS Config with the iam-user-mfa-enabled rule only.",
   "D": "IAM Access Analyzer external access findings."
  },
  "answer": [
   "A"
  ],
  "explanation": "The credential report is a single generated CSV covering every IAM user in the account, with columns for password enabled and last used, MFA active, and the creation, last-used and last-rotated dates for each access key, which answers all three questions at once. Option B records API activity, so building this picture from events would be laborious and would miss credentials that were simply never used. Option C answers only the MFA question. Option D reports resources shared outside the zone of trust and says nothing about credential age or MFA."
 },
 {
  "id": "dop-239",
  "source": "authored",
  "domain": 6,
  "topic": "Network isolation for builds",
  "difficulty": "medium",
  "multi": true,
  "question": "A regulated build must not send data to the public internet, but still needs to reach S3, ECR, Secrets Manager and CloudWatch Logs. Which TWO configurations achieve this?",
  "choices": {
   "A": "Run the CodeBuild project in private subnets with no NAT gateway route, so there is no path to the internet.",
   "B": "Create VPC endpoints for the required AWS services, with endpoint policies restricting access to approved resources.",
   "C": "Attach a security group to the build that denies outbound traffic on port 443 to all destinations.",
   "D": "Use a NAT gateway with a route table entry limited to the AWS public IP ranges.",
   "E": "Enable the build project's privileged mode so it can control its own network namespace."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Removing the internet route is what makes exfiltration impossible rather than merely discouraged, and interface and gateway VPC endpoints then provide private connectivity to the specific AWS services the build needs, with endpoint policies narrowing that further to approved buckets and repositories. Option C would block the very AWS API calls the build depends on, since those also use port 443. Option D still constitutes internet egress and the published ranges are broad and change over time, so it is neither a strong nor a stable control. Option E enables privileged container operations for use cases such as building Docker images and has nothing to do with network isolation."
 },
 {
  "id": "dop-240",
  "source": "authored",
  "domain": 6,
  "topic": "Custom compliance rules",
  "difficulty": "medium",
  "multi": false,
  "question": "An organisation has an internal standard that no security group may allow inbound access from 0.0.0.0/0 on any port other than 80 and 443. No managed AWS Config rule expresses this exactly. What is the most maintainable implementation?",
  "choices": {
   "A": "An AWS Config custom rule written with AWS CloudFormation Guard, which expresses the policy declaratively and is evaluated by Config without maintaining function code.",
   "B": "An AWS Config custom rule backed by a Lambda function that parses each security group and returns a compliance verdict.",
   "C": "A daily script that calls DescribeSecurityGroups and emails a report of violations.",
   "D": "An SCP denying the ec2:AuthorizeSecurityGroupIngress action entirely."
  },
  "answer": [
   "A"
  ],
  "explanation": "Config custom rules can be authored as Guard policies, which express the condition declaratively against the resource configuration and are evaluated by the service, so there is no function to package, deploy, patch or monitor — the lowest maintenance option that still expresses an arbitrary rule. Option B is the traditional approach and works, but carries function code and its lifecycle as ongoing cost. Option C is a detached report with no compliance history and no remediation hook. Option D blocks all ingress rule creation including the permitted ports, so legitimate work stops."
 },
 {
  "id": "dop-241",
  "source": "authored",
  "domain": 6,
  "topic": "Encryption key separation",
  "difficulty": "hard",
  "multi": false,
  "question": "A team must ensure that even an administrator in the workload account cannot decrypt archived audit data, while an automated process in that account continues writing new records. Which design achieves this?",
  "choices": {
   "A": "Encrypt the data with a KMS key owned by a separate security account, whose key policy grants the workload account's writer role kms:GenerateDataKey for encryption but grants kms:Decrypt only to principals in the security account.",
   "B": "Encrypt the data with a customer managed key in the workload account and attach an IAM policy denying kms:Decrypt to the administrator role.",
   "C": "Encrypt the data with an AWS managed key, since AWS managed keys cannot be used by account administrators.",
   "D": "Store the data in a separate bucket in the workload account with a bucket policy denying s3:GetObject to the administrator role."
  },
  "answer": [
   "A"
  ],
  "explanation": "Separating the key from the data is what makes this durable: because the key policy lives in the security account, an administrator in the workload account cannot alter it, and granting only the operations needed for encryption — GenerateDataKey — lets the writer produce new records without ever being able to read them back. Option B fails because a workload account administrator can modify or detach that IAM policy and the key policy alike. Option C misstates AWS managed keys, which are usable by principals in the account according to their IAM permissions. Option D controls object access rather than decryption and can likewise be changed by the administrator."
 },
 {
  "id": "dop-242",
  "source": "authored",
  "domain": 6,
  "topic": "Guardrails at scale",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is standing up a multi-account environment and wants preventive and detective guardrails, account provisioning with baseline configuration, and a landing zone, without assembling each component themselves. Which service should they start with?",
  "choices": {
   "A": "AWS Control Tower, which establishes a landing zone with organisational units, account provisioning through Account Factory, and preventive and detective controls implemented with SCPs and Config rules.",
   "B": "AWS Organizations alone, applying SCPs manually to organisational units created by hand.",
   "C": "AWS Config conformance packs deployed to each account individually.",
   "D": "AWS Service Catalog portfolios shared with each new account."
  },
  "answer": [
   "A"
  ],
  "explanation": "Control Tower is the opinionated landing zone service: it creates the organisational structure, log archive and audit accounts, centralised logging, Account Factory for provisioning accounts with a baseline, and a catalogue of controls implemented as SCPs for prevention and Config rules for detection. Option B provides the account structure and preventive policies but leaves the landing zone, baselines and detective controls to be built. Option C supplies detective rules only and no provisioning or preventive guardrails. Option D distributes approved products for launching resources rather than establishing an account environment."
 },
 {
  "id": "dop-243",
  "source": "authored",
  "domain": 6,
  "topic": "Protecting the artifact supply chain",
  "difficulty": "hard",
  "multi": true,
  "question": "A team wants to reduce the risk of a compromised build injecting malicious code into production. Which TWO practices most directly limit that risk?",
  "choices": {
   "A": "Separate the build identity from the deploy identity, so the role that compiles code cannot also push to production, and require the deploy step to consume a signed artifact.",
   "B": "Pin and verify third-party dependencies by digest or checksum rather than by mutable version tags, and resolve them through an internal repository that caches approved versions.",
   "C": "Give the build role administrator access so builds never fail on missing permissions.",
   "D": "Run builds in privileged mode so tooling that requires Docker works without workarounds.",
   "E": "Allow developers to trigger production deployments directly from their workstations for faster incident response."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Splitting build and deploy identities means compromising the build environment does not by itself grant the ability to release, and requiring a signed artifact at the deploy step gives an integrity check that a tampered build cannot satisfy. Pinning dependencies by digest and serving them through a controlled internal repository closes the other major injection path, in which a mutable upstream version is replaced with malicious content. Options C and D both widen what a compromised build can do, granting broad permissions and elevated container capabilities. Option E bypasses the pipeline's controls entirely and puts release capability on developer laptops."
 },
 {
  "id": "dop-244",
  "source": "authored",
  "domain": 6,
  "topic": "Secrets in function configuration",
  "difficulty": "medium",
  "multi": false,
  "question": "A Lambda function stores an API token in a plaintext environment variable. Security wants the value protected so that a principal able to call GetFunctionConfiguration cannot read it. What is the appropriate change?",
  "choices": {
   "A": "Move the value into AWS Secrets Manager or an SSM SecureString parameter and have the function retrieve and cache it at initialisation, so the configuration contains only a reference.",
   "B": "Enable encryption helpers on the environment variable with a customer managed key, so the console displays it encrypted.",
   "C": "Rename the environment variable so its purpose is not obvious to someone reading the configuration.",
   "D": "Move the value into the deployment package as a constant in the function code."
  },
  "answer": [
   "A"
  ],
  "explanation": "Keeping only a reference in the configuration means the secret is never returned by GetFunctionConfiguration, and access is governed separately by the secret's own resource policy and KMS key, with rotation possible without redeploying. Option B is a genuine improvement over plaintext and encrypts the variable at rest, but the function's role can decrypt it and the ciphertext plus decryption path remain part of the configuration, so it does not cleanly meet the stated requirement. Option C is security through obscurity and protects nothing. Option D moves the secret into the code package, where it is readable by anyone who can download the function and is baked into every version."
 },
 {
  "id": "dop-245",
  "source": "authored",
  "domain": 6,
  "topic": "Conditional access controls",
  "difficulty": "medium",
  "multi": false,
  "question": "A policy must permit an operations role to terminate EC2 instances only when the caller authenticated with multi-factor authentication in the current session. How is this expressed?",
  "choices": {
   "A": "A condition on the statement requiring aws:MultiFactorAuthPresent to be true, which is evaluated per request against the session's authentication context.",
   "B": "A condition requiring aws:SecureTransport to be true, which indicates the caller used a secure authenticated channel.",
   "C": "A trust policy on the role requiring MFA, which is sufficient because permissions derive from the trust relationship.",
   "D": "A permission boundary containing the MFA requirement, since boundaries evaluate authentication context."
  },
  "answer": [
   "A"
  ],
  "explanation": "The aws:MultiFactorAuthPresent condition key reflects whether the credentials making the request came from a session authenticated with MFA, so placing it on the statement gates the specific action per request. Option B indicates TLS was used for the request, which is about transport security rather than authentication strength. Option C is closer than it appears and requiring MFA in the trust policy is good practice, but it governs whether the role may be assumed rather than gating this particular action, and other paths into the session would not be covered. Option D can hold the same condition but boundaries cap permissions generally and are not the natural or sufficient place to express a per-action MFA requirement."
 },
 {
  "id": "dop-246",
  "source": "authored",
  "domain": 6,
  "topic": "Registry hardening",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants developers to pull public container images without reaching the public internet from build environments, while ensuring the images are scanned and retained internally. Which ECR feature supports this?",
  "choices": {
   "A": "An ECR pull through cache rule for the upstream public registry, so images are fetched once, stored in the private registry, and scanned according to the registry scanning configuration.",
   "B": "An ECR replication rule from the public registry into the private registry in each Region.",
   "C": "An ECR repository policy allowing anonymous pulls from the upstream registry.",
   "D": "A NAT gateway with a route restricted to the upstream registry's domain name."
  },
  "answer": [
   "A"
  ],
  "explanation": "A pull through cache rule links a namespace in the private registry to an upstream public registry: the first pull retrieves and stores the image privately, later pulls are served from ECR, and the cached images are subject to the registry's scanning configuration and lifecycle policies. Builds therefore reach only ECR, typically through a VPC endpoint. Option B misapplies replication, which copies images between your own registries across Regions and accounts, not from a third-party public registry. Option C describes granting others access to your repository, which is the opposite direction. Option D still requires internet egress and route tables cannot match domain names."
 },
 {
  "id": "dop-247",
  "source": "authored",
  "domain": 6,
  "topic": "Detecting configuration drift in security controls",
  "difficulty": "medium",
  "multi": false,
  "question": "A security baseline requires EBS encryption by default in every Region of every account. The team wants to know within a day if any account or Region deviates, with the result centrally visible. What should they configure?",
  "choices": {
   "A": "Deploy the ec2-ebs-encryption-by-default AWS Config rule to all accounts and Regions through a conformance pack or organisation rule, and aggregate compliance into a central account with a Config aggregator.",
   "B": "Enable EBS encryption by default manually in each account and Region and record completion in a spreadsheet.",
   "C": "Create a CloudWatch alarm on the EBS volume creation metric in each account.",
   "D": "Run a monthly Trusted Advisor review in the management account."
  },
  "answer": [
   "A"
  ],
  "explanation": "An organisation Config rule or conformance pack deploys the same managed rule everywhere with one action, evaluation is continuous so deviations surface well within a day, and a Config aggregator collects compliance status from all accounts and Regions into one central view. Option B establishes the setting once but detects nothing when it is later changed, and a spreadsheet is not a control. Option C counts volume creation and cannot report on the account-level encryption default. Option D is monthly rather than daily and Trusted Advisor does not cover this specific setting across all Regions."
 },
 {
  "id": "dop-248",
  "source": "authored",
  "domain": 6,
  "topic": "Segregation of duties",
  "difficulty": "medium",
  "multi": false,
  "question": "An auditor requires that no single individual can both author a change and release it to production. The team wants to satisfy this without slowing routine work unduly. Which implementation is appropriate?",
  "choices": {
   "A": "Enforce pull request approval by someone other than the author in the repository, and require the production release to proceed only through the pipeline, with no human holding direct deploy permissions in production.",
   "B": "Require two engineers to be present when a production deployment is triggered manually.",
   "C": "Grant production deploy permissions only to team leads, who also review and merge changes.",
   "D": "Log all production deployments to CloudTrail and review them at the end of each month."
  },
  "answer": [
   "A"
  ],
  "explanation": "The control is best expressed where it can be enforced rather than observed: a repository rule that an approval must come from someone other than the author separates authorship from authorisation, and removing standing human deploy permissions in production means release happens only through the reviewed pipeline, so the two duties cannot be held by one person. Option B relies on a procedural convention with no technical enforcement and adds friction to every release. Option C concentrates both duties in the same individuals, which is exactly the separation being required. Option D is a detective control that identifies violations after production has already changed."
 },
 {
  "id": "dop-249",
  "source": "authored",
  "domain": 6,
  "topic": "Web application protection in delivery",
  "difficulty": "medium",
  "multi": false,
  "question": "A team wants new web application firewall rules validated against real traffic before they block anything, so a badly written rule cannot cause an outage. Which approach supports this?",
  "choices": {
   "A": "Deploy the new rules in count mode first, observe the matched request metrics and sampled requests over a representative period, then switch the rules to block once the match rate is understood.",
   "B": "Deploy the rules in block mode in a staging web ACL and replay synthetic traffic against it.",
   "C": "Deploy the rules in block mode during a low-traffic window so any problem affects fewer users.",
   "D": "Enable only AWS managed rule groups, which never produce false positives."
  },
  "answer": [
   "A"
  ],
  "explanation": "Count mode is the built-in mechanism for evaluating a rule safely: it records which live requests would have matched, exposed through CloudWatch metrics and sampled requests, without affecting any of them, so a rule that would block legitimate traffic is identified before it can cause an outage. Option B tests against synthetic traffic, which rarely reproduces the diversity of real requests that causes false positives. Option C reduces exposure but still blocks real users with an unvalidated rule. Option D is untrue, since managed rule groups can and do match legitimate requests for some applications, which is why they too should be evaluated in count mode first."
 },
 {
  "id": "dop-250",
  "source": "authored",
  "domain": 6,
  "topic": "Balancing security controls and delivery speed",
  "difficulty": "hard",
  "multi": false,
  "question": "Security wants every deployment reviewed manually, while the delivery team releases twenty times per day and argues the review would become a rubber stamp. Which approach best serves both concerns?",
  "choices": {
   "A": "Encode the review criteria as automated checks in the pipeline — policy-as-code, dependency and secret scanning, and least-privilege deployment roles — and reserve human review for changes that the automation flags as high risk, such as IAM or network policy changes.",
   "B": "Reduce the deployment frequency to once per week so manual review is feasible.",
   "C": "Keep the manual review but allow the delivery team to self-approve when the change is small.",
   "D": "Remove the review requirement and rely on detective controls to find problems after deployment."
  },
  "answer": [
   "A"
  ],
  "explanation": "The disagreement dissolves once the review criteria are made explicit: anything that can be stated as a rule can be checked automatically on every change, consistently and in seconds, which is stronger than a human skimming twenty diffs a day. Reserving human attention for the genuinely risky categories preserves meaningful oversight where judgement adds value. Option B trades delivery capability for a process that the team has already argued becomes perfunctory. Option C nominally retains the control while allowing the reviewed party to approve their own change, which is not a control at all. Option D abandons prevention entirely, so problems are found only once they are in production."
 }
];

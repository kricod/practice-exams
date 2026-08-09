/* AWS ANS-C01 question bank — generated, do not edit by hand. */
window.QUESTIONS = [
 {
  "id": "dt-1",
  "source": "ditectrev",
  "domain": 1,
  "topic": "NLB / EKS load balancing",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is planning to create a service that requires encryption in transit. The traffic must not be decrypted between the client and the backend of the service. The company will implement the service by using the gRPC protocol over TCP port 443. The service will scale up to thousands of simultaneous connections. The backend of the service will be hosted on an Amazon Elastic Kubernetes Service (Amazon EKS) cluster with the Kubernetes Cluster Autoscaler and the Horizontal Pod Autoscaler configured. The company needs to use mutual TLS for two-way authentication between the client and the backend. Which solution will meet these requirements?",
  "choices": {
   "A": "Install the AWS Load Balancer Controller for Kubernetes. Using that controller, configure a Network Load Balancer with a TCP listener on port 443 to forward traffic to the IP addresses of the backend service Pods.",
   "B": "Install the AWS Load Balancer Controller for Kubernetes. Using that controller, configure an Application Load Balancer with an HTTPS listener on port 443 to forward traffic to the IP addresses of the backend service Pods.",
   "C": "Create a target group. Add the EKS managed node group's Auto Scaling group as a target Create an Application Load Balancer with an HTTPS listener on port 443 to forward traffic to the target group.",
   "D": "Create a target group. Add the EKS managed node group's Auto Scaling group as a target. Create a Network Load Balancer with a TLS listener on port 443 to forward traffic to the target group."
  },
  "answer": [
   "A"
  ],
  "explanation": "Mutual TLS with no decryption in the path requires a pure Layer 4 pass-through, which only a Network Load Balancer with a TCP listener provides: the NLB forwards the raw TCP stream so the TLS/mTLS handshake terminates on the backend pods themselves. Installing the AWS Load Balancer Controller and using IP target mode registers individual Pod IPs (via the VPC CNI), so the Horizontal Pod Autoscaler and Cluster Autoscaler can add and remove pods and the target group tracks them automatically. Option B is wrong because an ALB HTTPS listener terminates TLS at the load balancer (even though ALB supports gRPC and mTLS verification, the traffic is decrypted there). Option D's TLS listener also terminates TLS, and both C and D register the managed node group Auto Scaling group as instance targets, which relies on NodePort hopping and does not track pod-level scaling. NLB is also the right choice for scaling to thousands of long-lived gRPC connections."
 },
 {
  "id": "dt-2",
  "source": "ditectrev",
  "domain": 1,
  "topic": "ALB vs NLB",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is deploying a new application in the AWS Cloud. The company wants a highly available web server that will sit behind an Elastic Load Balancer. The load balancer will route requests to multiple target groups based on the URL in the request. All traffic must use HTTPS. TLS processing must be offloaded to the load balancer. The web server must know the user's IP address so that the company can keep accurate logs for security purposes. Which solution will meet these requirements?",
  "choices": {
   "A": "Deploy an Application Load Balancer with an HTTPS listener. Use path-based routing rules to forward the traffic to the correct target group. Include the X-Forwarded-For request header with traffic to the targets.",
   "B": "Deploy an Application Load Balancer with an HTTPS listener for each domain. Use host-based routing rules to forward the traffic to the correct target group for each domain. Include the X-Forwarded-For request header with traffic to the targets.",
   "C": "Deploy a Network Load Balancer with a TLS listener. Use path-based routing rules to forward the traffic to the correct target group. Configure client IP address preservation for traffic to the targets.",
   "D": "Deploy a Network Load Balancer with a TLS listener for each domain. Use host-based routing rules to forward the traffic to the correct target group for each domain. Configure client IP address preservation for traffic to the targets."
  },
  "answer": [
   "A"
  ],
  "explanation": "Path-based (URL) routing is a Layer 7 feature that only the Application Load Balancer provides, and an HTTPS listener on the ALB terminates TLS at the load balancer so the certificate and cipher processing are offloaded from the web servers. Because the ALB proxies the connection, the backend sees the ALB's IP as the source, so the ALB inserts the X-Forwarded-For header carrying the original client IP for the web server's logs. B fails because the requirement is to route on the URL path, not on hostnames/domains. C and D fail because a Network Load Balancer operates at Layer 4 and cannot make routing decisions based on URL path or HTTP host headers; NLB client IP preservation would work but the routing requirement cannot be met."
 },
 {
  "id": "dt-3",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Global Accelerator / ALB",
  "difficulty": "hard",
  "multi": false,
  "question": "A company has developed an application on AWS that will track inventory levels of vending machines and initiate the restocking process automatically. The company plans to integrate this application with vending machines and deploy the vending machines in several markets around the world. The application resides in a VPC in the us-east-1 Region. The application consists of an Amazon Elastic Container Service (Amazon ECS) cluster behind an Application Load Balancer (ALB). The communication from the vending machines to the application happens over HTTPS. The company is planning to use an AWS Global Accelerator accelerator and configure static IP addresses of the accelerator in the vending machines for application endpoint access. The application must be accessible only through the accelerator and not through a direct connection over the internet to the ALB endpoint. Which solution will meet these requirements?",
  "choices": {
   "A": "Configure the ALB in a private subnet of the VPC. Attach an internet gateway without adding routes in the subnet route tables to point to the internet gateway. Configure the accelerator with endpoint groups that include the ALB endpoint. Configure the ALB's security group to only allow inbound traffic from the internet on the ALB listener port.",
   "B": "Configure the ALB in a private subnet of the VPC. Configure the accelerator with endpoint groups that include the ALB endpoint. Configure the ALB's security group to only allow inbound traffic from the internet on the ALB listener port.",
   "C": "Configure the ALB in a public subnet of the VPC. Attach an internet gateway. Add routes in the subnet route tables to point to the internet gateway. Configure the accelerator with endpoint groups that include the ALB endpoint. Configure the ALB's security group to only allow inbound traffic from the accelerator's IP addresses on the ALB listener port.",
   "D": "Configure the ALB in a private subnet of the VPC. Attach an internet gateway. Add routes in the subnet route tables to point to the internet gateway. Configure the accelerator with endpoint groups that include the ALB endpoint. Configure the ALB's security group to only allow inbound traffic from the accelerator's IP addresses on the ALB listener port."
  },
  "answer": [
   "A"
  ],
  "explanation": "An internet-facing ALB can only be created if the VPC has an internet gateway attached, but the ALB nodes themselves become unreachable from the public internet if the subnets they live in have no 0.0.0.0/0 route to that internet gateway. AWS Global Accelerator reaches the ALB endpoint over the AWS global network rather than through the subnet's internet route, so the accelerator still works while direct internet connections to the ALB DNS name fail - exactly the isolation the company wants. B fails because an internet-facing ALB cannot be provisioned at all without an internet gateway attached to the VPC. C and D try to filter on the accelerator's IP addresses, but for ALB endpoints Global Accelerator always preserves the original client IP, so the ALB security group sees the vending machines' source addresses, not the accelerator's static IPs, and legitimate traffic would be dropped; C additionally adds the IGW route that re-exposes the ALB directly to the internet."
 },
 {
  "id": "dt-4",
  "source": "ditectrev",
  "domain": 1,
  "topic": "PrivateLink",
  "difficulty": "medium",
  "multi": false,
  "question": "A global delivery company is modernizing its fleet management system. The company has several business units. Each business unit designs and maintains applications that are hosted in its own AWS account in separate application VPCs in the same AWS Region. Each business unit's applications are designed to get data from a central shared services VPC. The company wants the network connectivity architecture to provide granular security controls. The architecture also must be able to scale as more business units consume data from the central shared services VPC in the future. Which solution will meet these requirements in the MOST secure manner?",
  "choices": {
   "A": "Create a central transit gateway. Create a VPC attachment to each application VPC. Provide full mesh connectivity between all the VPCs by using the transit gateway.",
   "B": "Create VPC peering connections between the central shared services VPC and each application VPC in each business unit's AWS account.",
   "C": "Create VPC endpoint services powered by AWS PrivateLink in the central shared services VPC. Create VPC endpoints in each application VPC.",
   "D": "Create a central transit VPC with a VPN appliance from AWS Marketplace. Create a VPN attachment from each VPC to the transit VPC. Provide full mesh connectivity among all the VPCs."
  },
  "answer": [
   "C"
  ],
  "explanation": "AWS PrivateLink (VPC endpoint services) exposes only a single specific service behind a Network Load Balancer rather than joining networks, so each business unit's VPC gets a unidirectional, one-way connection to just that shared service — the most granular, least-privileged option. It also scales cleanly: consumers are added by accepting endpoint connection requests (or via allowed-principal ARNs), with no route table changes, no CIDR overlap concerns, and no route/attachment limits per new business unit. A transit gateway with full mesh routing (A) creates broad network-level reachability between all VPCs, which is far more permissive than required. VPC peering (B) does not scale (peering is non-transitive and requires N connections plus route table edits in every account), and a Marketplace VPN transit VPC (D) adds appliance management, throughput limits, and cost with no security benefit."
 },
 {
  "id": "dt-5",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Direct Connect monitoring/capacity",
  "difficulty": "medium",
  "multi": false,
  "question": "A company uses a 4 Gbps AWS Direct Connect dedicated connection with a link aggregation group (LAG) bundle to connect to five VPCs that are deployed in the us-east-1 Region. Each VPC serves a different business unit and uses its own private VIF for connectivity to the on-premises environment. Users are reporting slowness when they access resources that are hosted on AWS. A network engineer finds that there are sudden increases in throughput and that the Direct Connect connection becomes saturated at the same time for about an hour each business day. The company wants to know which business unit is causing the sudden increase in throughput. The network engineer must find out this information and implement a solution to resolve the problem. Which solution will meet these requirements?",
  "choices": {
   "A": "Review the Amazon CloudWatch metrics for VirtualInterfaceBpsEgress and VirtualInterfaceBpsIngress to determine which VIF is sending the highest throughput during the period in which slowness is observed. Create a new 10 Gbps dedicated connection. Shift traffic from the existing dedicated connection to the new dedicated connection.",
   "B": "Review the Amazon CloudWatch metrics for VirtualInterfaceBpsEgress and VirtualInterfaceBpsIngress to determine which VIF is sending the highest throughput during the period in which slowness is observed. Upgrade the bandwidth of the existing dedicated connection to 10 Gbps.",
   "C": "Review the Amazon CloudWatch metrics for ConnectionBpsIngress and ConnectionPpsEgress to determine which VIF is sending the highest throughput during the period in which slowness is observed. Upgrade the existing dedicated connection to a 5 Gbps hosted connection.",
   "D": "Review the Amazon CloudWatch metrics for ConnectionBpsIngress and ConnectionPpsEgress to determine which VIF is sending the highest throughput during the period in which slowness is observed. Create a new 10 Gbps dedicated connection. Shift traffic from the existing dedicated connection to the new dedicated connection."
  },
  "answer": [
   "A"
  ],
  "explanation": "Direct Connect publishes per-VIF CloudWatch metrics under the AWS/DX namespace, and VirtualInterfaceBpsEgress/VirtualInterfaceBpsIngress are dimensioned by virtual interface ID, so they are the only metrics that can attribute the throughput spike to one business unit's private VIF. ConnectionBpsIngress/ConnectionPpsEgress are dimensioned by connection ID only, so they show aggregate link utilization and can never identify which VIF is the offender - that eliminates C and D. For remediation, the bandwidth of an existing dedicated connection cannot be changed in place; you must order a new dedicated connection at the higher port speed and migrate VIFs to it, so B is not possible. C also downgrades capacity (5 Gbps hosted connection) and hosted connections do not support LAG membership. A correctly pairs per-VIF metrics with provisioning a new 10 Gbps dedicated connection and shifting traffic to it."
 },
 {
  "id": "dt-6",
  "source": "ditectrev",
  "domain": 1,
  "topic": "PrivateLink / endpoint services",
  "difficulty": "medium",
  "multi": true,
  "question": "A software-as-a-service (SaaS) provider hosts its solution on Amazon EC2 instances within a VPC in the AWS Cloud. All of the provider's customers also have their environments in the AWS Cloud. A recent design meeting revealed that the customers have IP address overlap with the provider's AWS deployment. The customers have stated that they will not share their internal IP addresses and that they do not want to connect to the provider's SaaS service over the internet. Which combination of steps is part of a solution that meets these requirements? (Choose two.)",
  "choices": {
   "A": "Deploy the SaaS service endpoint behind a Network Load Balancer.",
   "B": "Configure an endpoint service, and grant the customers permission to create a connection to the endpoint service.",
   "C": "Deploy the SaaS service endpoint behind an Application Load Balancer.",
   "D": "Configure a VPC peering connection to the customer VPCs. Route traffic through NAT gateways.",
   "E": "Deploy an AWS Transit Gateway, and connect the SaaS VPC to it. Share the transit gateway with the customers. Configure routing on the transit gateway."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "AWS PrivateLink is purpose-built for this pattern: the provider fronts the service with a Network Load Balancer, creates a VPC endpoint service from that NLB, and grants consumer principals permission to create interface VPC endpoints to it. Because PrivateLink performs a NAT-like translation at the endpoint ENI, overlapping CIDRs between provider and consumer VPCs are irrelevant, and neither side ever exposes or learns the other's internal IP space. Traffic stays entirely on the AWS network, satisfying the no-internet requirement. Option C fails because endpoint services historically required an NLB or GWLB (ALB can only be used indirectly behind an NLB), and options D and E both break on the overlapping-IP constraint: VPC peering and Transit Gateway attachments require non-overlapping CIDRs and force customers to expose their internal addressing."
 },
 {
  "id": "dt-7",
  "source": "ditectrev",
  "domain": 4,
  "topic": "DDoS protection and inline inspection",
  "difficulty": "hard",
  "multi": true,
  "question": "A network engineer is designing the architecture for a healthcare company's workload that is moving to the AWS Cloud. All data to and from the on-premises environment must be encrypted in transit. All traffic also must be inspected in the cloud before the traffic is allowed to leave the cloud and travel to the on-premises environment or to the internet. The company will expose components of the workload to the internet so that patients can reserve appointments. The architecture must secure these components and protect them against DDoS attacks. The architecture also must provide protection against financial liability for services that scale out during a DDoS event. Which combination of steps should the network engineer take to meet all these requirements for the workload? (Choose three.)",
  "choices": {
   "A": "Use Traffic Mirroring to copy all traffic to a fleet of traffic capture appliances.",
   "B": "Set up AWS WAF on all network components.",
   "C": "Configure an AWS Lambda function to create Deny rules in security groups to block malicious IP addresses.",
   "D": "Use AWS Direct Connect with MACsec support for connectivity to the cloud.",
   "E": "Use Gateway Load Balancers to insert third-party firewalls for inline traffic inspection.",
   "F": "Configure AWS Shield Advanced and ensure that it is configured on all public assets."
  },
  "answer": [
   "D",
   "E",
   "F"
  ],
  "explanation": "MACsec on AWS Direct Connect provides Layer 2 line-rate encryption on dedicated 10 Gbps, 100 Gbps, and 400 Gbps connections, satisfying the encrypt-in-transit requirement for on-premises connectivity. Gateway Load Balancer with GENEVE on port 6081 lets you insert third-party virtual firewall appliances transparently and inline, so traffic is actually inspected and can be blocked before leaving the cloud. AWS Shield Advanced adds enhanced DDoS detection plus, critically, DDoS cost protection, which credits back scaling charges for protected resources such as ALB, CloudFront, Route 53, Global Accelerator, and EIPs during an attack, meeting the financial-liability requirement. Traffic Mirroring (A) only copies packets for out-of-band analysis and cannot block anything. AWS WAF (B) cannot be attached to 'all network components' and does not address encryption or financial liability, and Lambda-driven security group rules (C) are administratively fragile since security groups have no deny rules at all."
 },
 {
  "id": "dt-8",
  "source": "ditectrev",
  "domain": 3,
  "topic": "VPC Flow Logs / NAT Gateway",
  "difficulty": "easy",
  "multi": true,
  "question": "A retail company is running its service on AWS. The company's architecture includes Application Load Balancers (ALBs) in public subnets. The ALB target groups are configured to send traffic to backend Amazon EC2 instances in private subnets. These backend EC2 instances can call externally hosted services over the internet by using a NAT gateway. The company has noticed in its billing that NAT gateway usage has increased significantly. A network engineer needs to find out the source of this increased usage. Which options can the network engineer use to investigate the traffic through the NAT gateway? (Choose two.)",
  "choices": {
   "A": "Enable VPC flow logs on the NAT gateway's elastic network interface. Publish the logs to a log group in Amazon CloudWatch Logs. Use CloudWatch Logs Insights to query and analyze the logs.",
   "B": "Enable NAT gateway access logs. Publish the logs to a log group in Amazon CloudWatch Logs. Use CloudWatch Logs Insights to query and analyze the logs.",
   "C": "Configure Traffic Mirroring on the NAT gateway's elastic network interface. Send the traffic to an additional EC2 instance. Use tools such as tcpdump and Wireshark to query and analyze the mirrored traffic.",
   "D": "Enable VPC flow logs on the NAT gateway's elastic network interface. Publish the logs to an Amazon S3 bucket. Create a custom table for the S3 bucket in Amazon Athena to describe the log structure. Use Athena to query and analyze the logs.",
   "E": "Enable NAT gateway access logs. Publish the logs to an Amazon S3 bucket. Create a custom table for the S3 bucket in Amazon Athena to describe the log structure. Use Athena to query and analyze the logs."
  },
  "answer": [
   "A",
   "D"
  ],
  "explanation": "A NAT gateway is fronted by an elastic network interface, and VPC Flow Logs can be enabled on that ENI (or on the subnet/VPC containing it) to capture source, destination, port, protocol, and byte counts for every accepted and rejected flow - which is precisely what is needed to attribute the traffic volume driving the bill. Flow logs can be delivered to CloudWatch Logs and queried with CloudWatch Logs Insights (A), or delivered to Amazon S3 and queried with an Athena table defined over the flow log schema (D); both are supported destinations. B and E are wrong because NAT gateways have no such thing as 'access logs' - that feature exists for ELB, CloudFront, and S3, not NAT gateways. C is invalid because Traffic Mirroring sources must be ENIs of supported EC2 instance types; you cannot mirror from an AWS-managed NAT gateway ENI."
 },
 {
  "id": "dt-9",
  "source": "ditectrev",
  "domain": 2,
  "topic": "VPC IPv6 / Egress-Only Internet Gateway",
  "difficulty": "easy",
  "multi": false,
  "question": "A banking company is successfully operating its public mobile banking stack on AWS. The mobile banking stack is deployed in a VPC that includes private subnets and public subnets. The company is using IPv4 networking and has not deployed or supported IPv6 in the environment. The company has decided to adopt a third-party service provider's API and must integrate the API with the existing environment. The service provider's API requires the use of IPv6. A network engineer must turn on IPv6 connectivity for the existing workload that is deployed in a private subnet. The company does not want to permit IPv6 traffic from the public internet and mandates that the company's servers must initiate all IPv6 connectivity. The network engineer turns on IPv6 in the VPC and in the private subnets. Which solution will meet these requirements?",
  "choices": {
   "A": "Create an internet gateway and a NAT gateway in the VPC. Add a route to the existing subnet route tables to point IPv6 traffic to the NAT gateway.",
   "B": "Create an internet gateway and a NAT instance in the VPC. Add a route to the existing subnet route tables to point IPv6 traffic to the NAT instance.",
   "C": "Create an egress-only Internet gateway in the VPC. Add a route to the existing subnet route tables to point IPv6 traffic to the egress-only internet gateway.",
   "D": "Create an egress-only internet gateway in the VPC. Configure a security group that denies all inbound traffic. Associate the security group with the egress-only internet gateway."
  },
  "answer": [
   "C"
  ],
  "explanation": "An egress-only internet gateway is the IPv6 equivalent of a NAT gateway for outbound-only access: it is stateful, allows instances with IPv6 addresses in private subnets to initiate connections to the internet, and blocks any connection initiated from the internet toward those instances. Adding a ::/0 route pointing at the EIGW in the private subnet route tables is all that is needed. NAT gateways and NAT instances (A and B) perform IPv4 network address translation only — NAT gateways do not support IPv6 traffic in this manner (NAT64/DNS64 exists for IPv6-only clients reaching IPv4 targets, which is the opposite of this requirement). D is invalid because security groups are attached to ENIs, not to an egress-only internet gateway, and the EIGW already denies unsolicited inbound traffic by design."
 },
 {
  "id": "dt-10",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Network Firewall logging",
  "difficulty": "easy",
  "multi": false,
  "question": "A company has deployed an AWS Network Firewall firewall into a VPC. A network engineer needs to implement a solution to deliver Network Firewall flow logs to the company's Amazon OpenSearch Service (Amazon Elasticsearch Service) cluster in the shortest possible time. Which solution will meet these requirements?",
  "choices": {
   "A": "Create an Amazon S3 bucket. Create an AWS Lambda function to load logs into the Amazon OpenSearch Service (Amazon Elasticsearch Service) cluster. Enable Amazon Simple Notification Service (Amazon SNS) notifications on the S3 bucket to invoke the Lambda function. Configure flow logs for the firewall. Set the S3 bucket as the destination.",
   "B": "Create an Amazon Kinesis Data Firehose delivery stream that includes the Amazon OpenSearch Service (Amazon Elasticsearch Service) cluster as the destination. Configure flow logs for the firewall Set the Kinesis Data Firehose delivery stream as the destination for the Network Firewall flow logs.",
   "C": "Configure flow logs for the firewall. Set the Amazon OpenSearch Service (Amazon Elasticsearch Service) cluster as the destination for the Network Firewall flow logs.",
   "D": "Create an Amazon Kinesis data stream that includes the Amazon OpenSearch Service (Amazon Elasticsearch Service) cluster as the destination. Configure flow logs for the firewall. Set the Kinesis data stream as the destination for the Network Firewall flow logs."
  },
  "answer": [
   "B"
  ],
  "explanation": "AWS Network Firewall logging supports exactly three destinations for alert and flow logs: an S3 bucket, a CloudWatch Logs log group, or an Amazon Kinesis Data Firehose delivery stream. Firehose natively supports Amazon OpenSearch Service as a delivery destination and buffers with a configurable interval as low as ~60 seconds, giving the lowest-latency near-real-time path with no custom code, so B is correct. C is invalid because OpenSearch is not a supported native flow log destination for Network Firewall. D is invalid because a Kinesis data stream is not a supported destination type for Network Firewall logs, and a raw data stream cannot write to OpenSearch without a consumer. A works functionally but adds S3 batching plus SNS and Lambda, which is both slower and far more operationally complex."
 },
 {
  "id": "dt-11",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Route 53 Resolver / hybrid DNS",
  "difficulty": "hard",
  "multi": true,
  "question": "A company is using custom DNS servers that run BIND for name resolution in its VPCs. The VPCs are deployed across multiple AWS accounts that are part of the same organization in AWS Organizations. All the VPCs are connected to a transit gateway. The BIND servers are running in a central VPC and are configured to forward all queries for an on-premises DNS domain to DNS servers that are hosted in an on-premises data center. To ensure that all the VPCs use the custom DNS servers, a network engineer has configured a VPC DHCP options set in all the VPCs that specifies the custom DNS servers to be used as domain name servers. Multiple development teams in the company want to use Amazon Elastic File System (Amazon EFS). A development team has created a new EFS file system but cannot mount the file system to one of its Amazon EC2 instances. The network engineer discovers that the EC2 instance cannot resolve the IP address for the EFS mount point fs-33444567d.efs.us-east-1.amazonaws.com. The network engineer needs to implement a solution so that development teams throughout the organization can mount EFS file systems. Which combination of steps will meet these requirements? (Choose two.)",
  "choices": {
   "A": "Configure the BIND DNS servers in the central VPC to forward queries for efs.us-east-1.amazonaws.com to the Amazon provided DNS server (169.254.169.253).",
   "B": "Create an Amazon Route 53 Resolver outbound endpoint in the central VPC. Update all the VPC DHCP options sets to use AmazonProvidedDNS for name resolution.",
   "C": "Create an Amazon Route 53 Resolver inbound endpoint in the central VPC. Update all the VPC DHCP options sets to use the Route 53 Resolver inbound endpoint in the central VPC for name resolution.",
   "D": "Create an Amazon Route 53 Resolver rule to forward queries for the on-premises domain to the on-premises DNS servers. Share the rule with the organization by using AWS Resource Access Manager (AWS RAM). Associate the rule with all the VPCs.",
   "E": "Create an Amazon Route 53 private hosted zone for the efs.us-east-1.amazonaws.com domain. Associate the private hosted zone with the VPC where the EC2 instance is deployed. Create an A record for fs-33444567d.efs.us-east-1.amazonaws.com in the private hosted zone. Configure the A record to return the mount target of the EFS mount point."
  },
  "answer": [
   "B",
   "D"
  ],
  "explanation": "EFS mount target DNS names (fs-xxxx.efs.region.amazonaws.com) resolve only through the Route 53 Resolver (.2 address) of the VPC that owns the mount targets, so any design that funnels resolution through BIND servers in a different VPC will fail. The fix is to point every VPC's DHCP options set back to AmazonProvidedDNS so each VPC's own Resolver answers AWS service names, and then create a Route 53 Resolver outbound endpoint plus a forwarding rule for the on-premises domain, shared organization-wide with AWS RAM and associated with all VPCs, so on-premises name resolution still works. Option A fails because forwarding to 169.254.169.253 from the central VPC still resolves in the central VPC's context and cannot return another VPC's mount target IPs. Option C is backwards: an inbound endpoint is for on-premises resolvers querying into AWS, and it would reintroduce the same wrong-VPC resolution problem. Option E is a fragile manual workaround that must be repeated for every file system and every VPC, and mount target IPs can change."
 },
 {
  "id": "dt-12",
  "source": "ditectrev",
  "domain": 1,
  "topic": "NLB TLS passthrough",
  "difficulty": "easy",
  "multi": false,
  "question": "An ecommerce company is hosting a web application on Amazon EC2 instances to handle continuously changing customer demand. The EC2 instances are part of an Auto Scaling group. The company wants to implement a solution to distribute traffic from customers to the EC2 instances. The company must encrypt all traffic at all stages between the customers and the application servers. No decryption at intermediate points is allowed. Which solution will meet these requirements?",
  "choices": {
   "A": "Create an Application Load Balancer (ALB). Add an HTTPS listener to the ALB. Configure the Auto Scaling group to register instances with the ALB's target group.",
   "B": "Create an Amazon CloudFront distribution. Configure the distribution with a custom SSL/TLS certificate. Set the Auto Scaling group as the distribution's origin.",
   "C": "Create a Network Load Balancer (NLB). Add a TCP listener to the NLB. Configure the Auto Scaling group to register instances with the NLB's target group.",
   "D": "Create a Gateway Load Balancer (GLB). Configure the Auto Scaling group to register instances with the GLB's target group."
  },
  "answer": [
   "C"
  ],
  "explanation": "A Network Load Balancer with a plain TCP listener forwards the encrypted byte stream untouched to the targets, so TLS is terminated on the EC2 instances themselves and no intermediary ever holds the session keys, which is exactly what true end-to-end encryption with no intermediate decryption requires. An ALB with an HTTPS listener (A) is a full Layer 7 proxy that must decrypt the request to inspect headers, so decryption happens at an intermediate point. CloudFront (B) likewise terminates TLS at the edge and opens a new connection to the origin, and an Auto Scaling group cannot be a CloudFront origin. A Gateway Load Balancer (D) is for inserting inline security appliances using GENEVE encapsulation and is not a general-purpose application traffic distributor for a web tier."
 },
 {
  "id": "dt-13",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Direct Connect BGP",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has two on-premises data center locations. There is a company-managed router at each data center. Each data center has a dedicated AWS Direct Connect connection to a Direct Connect gateway through a private virtual interface. The router for the first location is advertising 110 routes to the Direct Connect gateway by using BGP, and the router for the second location is advertising 60 routes to the Direct Connect gateway by using BGP. The Direct Connect gateway is attached to a company VPC through a virtual private gateway. A network engineer receives reports that resources in the VPC are not reachable from various locations in either data center. The network engineer checks the VPC route table and sees that the routes from the first data center location are not being populated into the route table. The network engineer must resolve this issue in the most operationally efficient manner. What should the network engineer do to meet these requirements?",
  "choices": {
   "A": "Remove the Direct Connect gateway, and create a new private virtual interface from each company router to the virtual private gateway of the VPC.",
   "B": "Change the router configurations to summarize the advertised routes.",
   "C": "Open a support ticket to increase the quota on advertised routes to the VPC route table.",
   "D": "Create an AWS Transit Gateway. Attach the transit gateway to the VPC, and connect the Direct Connect gateway to the transit gateway."
  },
  "answer": [
   "B"
  ],
  "explanation": "AWS Direct Connect enforces a hard quota of 100 routes advertised per BGP session on a private or transit virtual interface. The first data center is advertising 110 prefixes, which exceeds the limit; when this happens the BGP session is torn down or the prefixes are dropped, which is why none of that location's routes appear in the VPC route table while the 60-route site works fine. Summarizing the advertisements on the customer router (B) brings the count under 100 with no architectural change, making it the most operationally efficient fix. C is wrong because the 100-route Direct Connect BGP limit is a hard quota that AWS Support cannot raise. A and D are large redesigns that do not change the per-BGP-session route limit at all - a transit gateway attachment via Direct Connect gateway still caps advertised prefixes (and imposes its own allowed-prefix limits)."
 },
 {
  "id": "dt-14",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Route 53 Resolver / Private Hosted Zones",
  "difficulty": "hard",
  "multi": true,
  "question": "A company has expanded its network to the AWS Cloud by using a hybrid architecture with multiple AWS accounts. The company has set up a shared AWS account for the connection to its on-premises data centers and the company offices. The workloads consist of private web-based services for internal use. These services run in different AWS accounts. Office-based employees consume these services by using a DNS name in an on-premises DNS zone that is named example.internal. The process to register a new service that runs on AWS requires a manual and complicated change request to the internal DNS. The process involves many teams. The company wants to update the DNS registration process by giving the service creators access that will allow them to register their DNS records. A network engineer must design a solution that will achieve this goal. The solution must maximize cost-effectiveness and must require the least possible number of configuration changes. Which combination of steps should the network engineer take to meet these requirements? (Choose three.)",
  "choices": {
   "A": "Create a record for each service in its local private hosted zone (serviceA.account1.aws.example.internal). Provide this DNS record to the employees who need access.",
   "B": "Create an Amazon Route 53 Resolver inbound endpoint in the shared account VPC. Create a conditional forwarder for a domain named aws.example.internal on the on-premises DNS servers. Set the forwarding IP addresses to the inbound endpoint's IP addresses that were created.",
   "C": "Create an Amazon Route 53 Resolver rule to forward any queries made to onprem.example.internal to the on-premises DNS servers.",
   "D": "Create an Amazon Route 53 private hosted zone named aws.example.internal in the shared AWS account to resolve queries for this domain.",
   "E": "Launch two Amazon EC2 instances in the shared AWS account. Install BIND on each instance. Create a DNS conditional forwarder on each BIND server to forward queries for each subdomain under aws.example.internal to the appropriate private hosted zone in each AWS account. Create a conditional forwarder for a domain named aws.example.internal on the on-premises DNS servers. Set the forwarding IP addresses to the IP addresses of the BIND servers.",
   "F": "Create a private hosted zone in the shared AWS account for each account that runs the service. Configure the private hosted zone to contain aws.example.internal in the domain (account1.aws.example.internal, for example). Associate the private hosted zone with the VPC that runs the service and the shared account VPC."
  },
  "answer": [
   "B",
   "D",
   "F"
  ],
  "explanation": "The scalable pattern is to delegate a subdomain (aws.example.internal) to Route 53 and let each service team own records in its own account. D creates the parent private hosted zone in the shared account so the namespace exists, F creates per-account private hosted zones such as account1.aws.example.internal that are associated with both the service VPC and the shared VPC — Route 53 Resolver automatically resolves the most specific matching private hosted zone associated with the querying VPC, so no delegation NS records or forwarders are needed between them. B creates a Route 53 Resolver inbound endpoint in the shared VPC and points an on-premises conditional forwarder for aws.example.internal at its IPs, giving office employees resolution with a single one-time on-premises DNS change. C is about outbound (AWS to on-premises) resolution, which is not the requirement. E reintroduces self-managed BIND EC2 instances, adding cost and operational overhead that Route 53 Resolver eliminates. A only works if the record names match existing zones and still leaves on-premises resolution unsolved."
 },
 {
  "id": "dt-15",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Transit Gateway appliance mode",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has multiple AWS accounts. Each account contains one or more VPCs. A new security guideline requires the inspection of all traffic between VPCs. The company has deployed a transit gateway that provides connectivity between all VPCs. The company also has deployed a shared services VPC with Amazon EC2 instances that include IDS services for stateful inspection. The EC2 instances are deployed across three Availability Zones. The company has set up VPC associations and routing on the transit gateway. The company has migrated a few test VPCs to the new solution for traffic inspection. Soon after the configuration of routing, the company receives reports of intermittent connections for traffic that crosses Availability Zones. What should a network engineer do to resolve this issue?",
  "choices": {
   "A": "Modify the transit gateway VPC attachment on the shared services VPC by enabling cross-Availability Zone load balancing.",
   "B": "Modify the transit gateway VPC attachment on the shared services VPC by enabling appliance mode support.",
   "C": "Modify the transit gateway by selecting VPN equal-cost multi-path (ECMP) routing support.",
   "D": "Modify the transit gateway by selecting multicast support."
  },
  "answer": [
   "B"
  ],
  "explanation": "By default a Transit Gateway VPC attachment keeps traffic in the Availability Zone it arrives in and hashes flows independently in each direction, so a stateful inspection appliance can see the forward flow land on the AZ-A appliance while the return flow lands on the AZ-B appliance. The stateful IDS/firewall then drops the asymmetric return traffic, which appears as intermittent failures for cross-AZ flows. Enabling appliance mode support on the inspection (shared services) VPC attachment makes the transit gateway use a consistent flow hash for the life of the flow, pinning both directions of a connection to the same appliance and the same AZ. There is no 'cross-AZ load balancing' setting on a TGW attachment, so A is fictitious. VPN ECMP (C) only affects multi-tunnel Site-to-Site VPN path selection, and multicast support (D) is unrelated to unicast inspection traffic."
 },
 {
  "id": "dt-16",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Interface VPC endpoints",
  "difficulty": "medium",
  "multi": true,
  "question": "A company is using a NAT gateway to allow internet connectivity for private subnets in a VPC in the us-west-2 Region. After a security audit, the company needs to remove the NAT gateway. In the private subnets, the company has resources that use the unified Amazon CloudWatch agent. A network engineer must create a solution to ensure that the unified CloudWatch agent continues to work after the removal of the NAT gateway. Which combination of steps should the network engineer take to meet these requirements? (Choose three.)",
  "choices": {
   "A": "Validate that private DNS is enabled on the VPC by setting the enableDnsHostnames VPC attribute and the enableDnsSupport VPC attribute to true.",
   "B": "Create a new security group with an entry to allow outbound traffic that uses the TCP protocol on port 443 to destination 0.0.0.0/0.",
   "C": "Create a new security group with entries to allow inbound traffic that uses the TCP protocol on port 443 from the IP prefixes of the private subnets.",
   "D": "Create the following interface VPC endpoints in the VPC: com.amazonaws.us-west-2.logs and com.amazonaws.us-west-2.monitoring. Associate the new security group with the endpoint network interfaces.",
   "E": "Create the following interface VPC endpoint in the VPC: com.amazonaws.us-west-2.cloudwatch. Associate the new security group with the endpoint network interfaces.",
   "F": "Associate the VPC endpoint or endpoints with route tables that the private subnets use."
  },
  "answer": [
   "A",
   "C",
   "D"
  ],
  "explanation": "The unified CloudWatch agent publishes metrics to the monitoring API and logs to the logs API, so removing the NAT gateway requires interface VPC endpoints for com.amazonaws.us-west-2.monitoring and com.amazonaws.us-west-2.logs (D). Private DNS on an interface endpoint only works when both enableDnsSupport and enableDnsHostnames are true on the VPC (A), otherwise the agent keeps resolving the public service names. The security group attached to the endpoint ENIs must allow inbound TCP 443 from the private subnet CIDRs (C) because the ENI is the destination of the traffic; option B describes an outbound rule on the wrong side of the connection. Option E uses a non-existent endpoint service name (the CloudWatch metrics endpoint is 'monitoring', not 'cloudwatch'), and option F is wrong because interface endpoints work through DNS and ENIs, not route table entries - only gateway endpoints (S3/DynamoDB) require route table associations."
 },
 {
  "id": "dt-17",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Global Accelerator",
  "difficulty": "medium",
  "multi": false,
  "question": "An international company provides early warning about tsunamis. The company plans to use IoT devices to monitor sea waves around the world. The data that is collected by the IoT devices must reach the company's infrastructure on AWS as quickly as possible. The company is using three operation centers around the world. Each operation center is connected to AWS through Its own AWS Direct Connect connection. Each operation center is connected to the internet through at least two upstream internet service providers. The company has its own provider-independent (PI) address space. The IoT devices use TCP protocols for reliable transmission of the data they collect. The IoT devices have both landline and mobile internet connectivity. The infrastructure and the solution will be deployed in multiple AWS Regions. The company will use Amazon Route 53 for DNS services. A network engineer needs to design connectivity between the IoT devices and the services that run in the AWS Cloud. Which solution will meet these requirements with the HIGHEST availability?",
  "choices": {
   "A": "Set up an Amazon CloudFront distribution with origin failover. Create an origin group for each Region where the solution is deployed.",
   "B": "Set up Route 53 latency-based routing. Add latency alias records. For the latency alias records, set the value of Evaluate Target Health to Yes.",
   "C": "Set up an accelerator in AWS Global Accelerator. Configure Regional endpoint groups and health checks.",
   "D": "Set up Bring Your Own IP (BYOIP) addresses. Use the same PI addresses for each Region where the solution is deployed."
  },
  "answer": [
   "C"
  ],
  "explanation": "AWS Global Accelerator gives clients two static anycast IP addresses advertised from the AWS global edge network, so TCP sessions from the IoT devices enter the AWS backbone at the nearest edge location and are routed to healthy Regional endpoint groups. Failover is driven by health checks at the network layer and takes effect in about a minute without any dependency on client-side DNS caching, which is the key availability advantage. Route 53 latency-based routing with Evaluate Target Health (B) still relies on DNS TTLs and resolver/device caching, so failover is slower and less reliable for embedded IoT clients. CloudFront origin failover (A) is oriented toward HTTP/S content delivery, not arbitrary TCP telemetry, and BYOIP alone (D) provides address portability but no health checking or automatic failover."
 },
 {
  "id": "dt-18",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect MACsec",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is planning a migration of its critical workloads from an on-premises data center to Amazon EC2 instances. The plan includes a new 10 Gbps AWS Direct Connect dedicated connection from the on-premises data center to a VPC that is attached to a transit gateway. The migration must occur over encrypted paths between the on-premises data center and the AWS Cloud. Which solution will meet these requirements while providing the HIGHEST throughput?",
  "choices": {
   "A": "Configure a public VIF on the Direct Connect connection. Configure an AWS Site-to-Site VPN connection to the transit gateway as a VPN attachment.",
   "B": "Configure a transit VIF on the Direct Connect connection. Configure an IPsec VPN connection to an EC2 instance that is running third-party VPN software.",
   "C": "Configure MACsec for the Direct Connect connection. Configure a transit VIF to a Direct Connect gateway that is associated with the transit gateway.",
   "D": "Configure a public VIF on the Direct Connect connection. Configure two AWS Site-to-Site VPN connections to the transit gateway. Enable equal-cost multi-path (ECMP) routing."
  },
  "answer": [
   "C"
  ],
  "explanation": "MACsec (IEEE 802.1AE) provides line-rate Layer 2 encryption on dedicated 10 Gbps and 100 Gbps Direct Connect connections between the customer router and the AWS Direct Connect device, so the full 10 Gbps of the circuit remains usable while traffic is encrypted. Pairing it with a transit VIF to a Direct Connect gateway associated with the transit gateway gives the required connectivity to the transit-gateway-attached VPC. A and D rely on Site-to-Site VPN over a public VIF: each IPsec tunnel is limited to roughly 1.25 Gbps, so even with two ECMP-enabled connections you reach only a few Gbps, far below the dedicated circuit's capacity. B is invalid because Site-to-Site VPN requires a public VIF, not a transit VIF, and terminating IPsec on a self-managed EC2 appliance adds an instance-bandwidth bottleneck plus significant operational burden."
 },
 {
  "id": "dt-19",
  "source": "ditectrev",
  "domain": 2,
  "topic": "CloudFormation / Network Automation",
  "difficulty": "medium",
  "multi": false,
  "question": "A network engineer must develop an AWS CloudFormation template that can create a virtual private gateway, a customer gateway, a VPN connection, and static routes in a route table. During testing of the template, the network engineer notes that the CloudFormation template has encountered an error and is rolling back. What should the network engineer do to resolve the error?",
  "choices": {
   "A": "Change the order of resource creation in the CloudFormation template.",
   "B": "Add the DependsOn attribute to the resource declaration for the virtual private gateway. Specify the route table entry resource.",
   "C": "Add a wait condition in the template to wait for the creation of the virtual private gateway.",
   "D": "Add the DependsOn attribute to the resource declaration for the route table entry. Specify the virtual private gateway resource."
  },
  "answer": [
   "D"
  ],
  "explanation": "CloudFormation parallelizes resource creation when no dependency is expressed, so a static route (AWS::EC2::Route) that targets a virtual private gateway can be attempted before the gateway is created and attached, causing a failure and rollback. Adding DependsOn to the route table entry naming the virtual private gateway (and its VPC gateway attachment) forces CloudFormation to create the gateway first. D states this correctly. B has the dependency backwards — making the virtual private gateway depend on the route would deadlock the logic and not fix the ordering. A is ineffective because the order of resources in the template body does not control creation order; only intrinsic references (Ref/GetAtt) and DependsOn do. C is wrong because WaitConditions are meant for signals from EC2/on-instance bootstrap processes, not for sequencing AWS-managed resources."
 },
 {
  "id": "dt-20",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect gateway/BGP routing design",
  "difficulty": "hard",
  "multi": true,
  "question": "A company operates its IT services through a multi-site hybrid infrastructure. The company deploys resources on AWS in the us-east-1 Region and in the eu-west-2 Region. The company also deploys resources in its own data centers that are located in the United States (US) and in the United Kingdom (UK). In both AWS Regions, the company uses a transit gateway to connect 15 VPCs to each other. The company has created a transit gateway peering connection between the two transit gateways. The VPC CIDR blocks do not overlap with each other or with IP addresses used within the data centers. The VPC CIDR prefixes can also be aggregated either on a Regional level or for the company's entire AWS environment. The data centers are connected to each other by a private WAN connection. IP routing information is exchanged dynamically through Interior BGP (iBGP) sessions. The data centers maintain connectivity to AWS through one AWS Direct Connect connection in the US and one Direct Connect connection in the UK. Each Direct Connect connection is terminated on a Direct Connect gateway and is associated with a local transit gateway through a transit VIF. Traffic follows the shortest geographical path from source to destination. For example, packets from the UK data center that are targeted to resources in eu-west-2 travel across the local Direct Connect connection. In cases of cross-Region data transfers, such as from the UK data center to VPCs in us-east-1, the private WAN connection must be used to minimize costs on AWS. A network engineer has configured each transit gateway association on the Direct Connect gateway to advertise VPC-specific CIDR IP prefixes only from the local Region. The routes toward the other Region must be learned through BGP from the routers in the other data center in the original, non-aggregated form. The company recently experienced a problem with cross-Region data transfers because of issues with its private WAN connection. The network engineer needs to modify the routing setup to prevent similar interruptions in the future. The solution cannot modify the original traffic routing goal when the network is operating normally. Which modifications will meet these requirements? (Choose two.)",
  "choices": {
   "A": "Remove all the VPC CIDR prefixes from the list of subnets advertised through the local Direct Connect connection. Add the company's entire AWS environment aggregate route to the list of subnets advertised through the local Direct Connect connection.",
   "B": "Add the CIDR prefixes from the other Region VPCs and the local VPC CIDR blocks to the list of subnets advertised through the local Direct Connect connection. Configure data center routers to make routing decisions based on the BGP communities received.",
   "C": "Add the aggregate IP prefix for the other Region and the local VPC CIDR blocks to the list of subnets advertised through the local Direct Connect connection.",
   "D": "Add the aggregate IP prefix for the company's entire AWS environment and the local VPC CIDR blocks to the list of subnets advertised through the local Direct Connect connection.",
   "E": "Remove all the VPC CIDR prefixes from the list of subnets advertised through the local Direct Connect connection. Add both Regional aggregate IP prefixes to the list of subnets advertised through the Direct Connect connection on both sides of the network. Configure data center routers to make routing decisions based on the BGP communities received."
  },
  "answer": [
   "C",
   "E"
  ],
  "explanation": "Today each Direct Connect gateway association advertises only the local Region's specific VPC prefixes, so the remote Region's more-specific prefixes learned via iBGP over the private WAN always win by longest-prefix match - which is exactly the desired steady-state behavior but leaves no fallback when the WAN fails. Option C fixes this by additionally advertising a single aggregate covering the other Region over the local Direct Connect connection: because the aggregate is less specific than the individual VPC prefixes learned over the WAN, normal routing is unchanged, but if the WAN drops, the aggregate becomes the only path and traffic flows over the local Direct Connect connection and across the transit gateway peering. Option E achieves the same failover a different way - advertise only the two Regional aggregates on both Direct Connect connections and use the BGP communities that Direct Connect attaches (or customer-set communities) so the data center routers set local preference to prefer the WAN for the remote Region while retaining the Direct Connect path as a backup. A and D advertise a single whole-environment aggregate, which makes the local and remote Region prefixes indistinguishable and breaks the shortest-geographical-path goal. B re-advertises the remote Region's individual, non-aggregated VPC prefixes over Direct Connect, which ties the routing to identical prefix lengths and defeats the longest-prefix design."
 },
 {
  "id": "dt-21",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Traffic Mirroring",
  "difficulty": "medium",
  "multi": false,
  "question": "A company's network engineer needs to design a new solution to help troubleshoot and detect network anomalies. The network engineer has configured Traffic Mirroring. However, the mirrored traffic is overwhelming the Amazon EC2 instance that is the traffic mirror target. The EC2 instance hosts tools that the company's security team uses to analyze the traffic. The network engineer needs to design a highly available solution that can scale to meet the demand of the mirrored traffic. Which solution will meet these requirements?",
  "choices": {
   "A": "Deploy a Network Load Balancer (NLB) as the traffic mirror target. Behind the NLB. deploy a fleet of EC2 instances in an Auto Scaling group. Use Traffic Mirroring as necessary.",
   "B": "Deploy an Application Load Balancer (ALB) as the traffic mirror target. Behind the ALB, deploy a fleet of EC2 instances in an Auto Scaling group. Use Traffic Mirroring only during non-business hours.",
   "C": "Deploy a Gateway Load Balancer (GLB) as the traffic mirror target. Behind the GLB. deploy a fleet of EC2 instances in an Auto Scaling group. Use Traffic Mirroring as necessary.",
   "D": "Deploy an Application Load Balancer (ALB) with an HTTPS listener as the traffic mirror target. Behind the ALB. deploy a fleet of EC2 instances in an Auto Scaling group. Use Traffic Mirroring only during active events or business hours."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC Traffic Mirroring encapsulates mirrored packets in VXLAN over UDP port 4789, and the only load-balanced target type that supports this is a Network Load Balancer with a UDP listener, which distributes the mirrored sessions across a fleet of analyzer instances in an Auto Scaling group across multiple Availability Zones. That gives both the horizontal scale and the high availability the design needs, without limiting when mirroring runs. Options B and D are invalid because an Application Load Balancer is a Layer 7 HTTP/HTTPS load balancer and can never be a traffic mirror target; it cannot handle VXLAN-encapsulated UDP. Option C is also wrong as written: a Gateway Load Balancer expects GENEVE on port 6081 for inline inspection, and the supported mirror target in that family is a GWLB endpoint, not the GWLB itself. Restricting mirroring to non-business hours (B and D) also fails the requirement to detect anomalies continuously."
 },
 {
  "id": "dt-22",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Route 53 Resolver endpoints",
  "difficulty": "medium",
  "multi": true,
  "question": "A company uses a hybrid architecture and has an AWS Direct Connect connection between its on-premises data center and AWS. The company has production applications that run in the on-premises data center. The company also has production applications that run in a VPC. The applications that run in the on-premises data center need to communicate with the applications that run in the VPC. The company is using corp.example.com as the domain name for the on-premises resources and is using an Amazon Route 53 private hosted zone for aws.example.com to host the VPC resources. The company is using an open-source recursive DNS resolver in a VPC subnet and is using a DNS resolver in the on-premises data center. The company's on-premises DNS resolver has a forwarder that directs requests for the aws.example.com domain name to the DNS resolver in the VPC. The DNS resolver in the VPC has a forwarder that directs requests for the corp.example.com domain name to the DNS resolver in the on-premises data center. The company has decided to replace the open-source recursive DNS resolver with Amazon Route 53 Resolver endpoints. Which combination of steps should a network engineer take to make this replacement? (Choose three.)",
  "choices": {
   "A": "Create a Route 53 Resolver rule to forward aws.example.com domain queries to the IP addresses of the outbound endpoint.",
   "B": "Configure the on-premises DNS resolver to forward aws.example.com domain queries to the IP addresses of the inbound endpoint.",
   "C": "Create a Route 53 Resolver inbound endpoint and a Route 53 Resolver outbound endpoint.",
   "D": "Create a Route 53 Resolver rule to forward aws.example.com domain queries to the IP addresses of the inbound endpoint.",
   "E": "Create a Route 53 Resolver rule to forward corp.example.com domain queries to the IP address of the on-premises DNS resolver.",
   "F": "Configure the on-premises DNS resolver to forward aws.example.com queries to the IP addresses of the outbound endpoint."
  },
  "answer": [
   "B",
   "C",
   "E"
  ],
  "explanation": "Replacing a self-managed resolver requires both Route 53 Resolver endpoint types (C): an inbound endpoint so on-premises resolvers can send queries into the VPC, and an outbound endpoint so VPC queries can be forwarded out to on-premises. The on-premises DNS server's conditional forwarder for aws.example.com must now point at the inbound endpoint's ENI IP addresses (B), because inbound endpoints are the only ingress path for external DNS queries into Route 53. For the reverse direction, a Resolver forwarding rule for corp.example.com targeting the on-premises DNS server IPs, associated with the VPC, sends those queries out through the outbound endpoint (E). A and D are wrong because forwarding rules never target Resolver endpoint IPs; a rule specifies the external target servers and the outbound endpoint that carries the query. F is wrong because on-premises servers must never be pointed at outbound endpoint IPs, which only handle egress from the VPC."
 },
 {
  "id": "dt-23",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Transit Gateway / Gateway Load Balancer",
  "difficulty": "hard",
  "multi": true,
  "question": "A government contractor is designing a multi-account environment with multiple VPCs for a customer. A network security policy requires all traffic between any two VPCs to be transparently inspected by a third-party appliance. The customer wants a solution that features AWS Transit Gateway. The setup must be highly available across multiple Availability Zones, and the solution needs to support automated failover. Furthermore, asymmetric routing is not supported by the inspection appliances. Which combination of steps is part of a solution that meets these requirements? (Choose two.)",
  "choices": {
   "A": "Deploy two clusters that consist of multiple appliances across multiple Availability Zones in a designated inspection VPC. Connect the inspection VPC to the transit gateway by using a VPC attachment. Create a target group, and register the appliances with the target group. Create a Network Load Balancer (NLB), and set it up to forward to the newly created target group. Configure a default route in the inspection VPCs transit gateway subnet toward the NLB.",
   "B": "Deploy two clusters that consist of multiple appliances across multiple Availability Zones in a designated inspection VPC. Connect the inspection VPC to the transit gateway by using a VPC attachment. Create a target group, and register the appliances with the target group. Create a Gateway Load Balancer, and set it up to forward to the newly created target group. Configure a default route in the inspection VPC's transit gateway subnet toward the Gateway Load Balancer endpoint.",
   "C": "Configure two route tables on the transit gateway. Associate one route table with all the attachments of the application VPCs. Associate the other route table with the inspection VPC's attachment. Propagate all VPC attachments into the inspection route table. Define a static default route in the application route table. Enable appliance mode on the attachment that connects the inspection VPC.",
   "D": "Configure two route tables on the transit gateway. Associate one route table with all the attachments of the application VPCs. Associate the other route table with the inspection VPCs attachment. Propagate all VPC attachments into the application route table. Define a static default route in the inspection route table. Enable appliance mode on the attachment that connects the inspection VPC.",
   "E": "Configure one route table on the transit gateway. Associate the route table with all the VPCs. Propagate all VPC attachments into the route table. Define a static default route in the route table."
  },
  "answer": [
   "B",
   "C"
  ],
  "explanation": "Gateway Load Balancer is the purpose-built service for transparently inserting third-party virtual appliances: it uses the GENEVE protocol on port 6081, preserves the original packet, spreads targets across Availability Zones with health checks for automated failover, and - critically - uses 5-tuple flow stickiness so both directions of a flow land on the same appliance, satisfying the no-asymmetric-routing constraint (B). A Network Load Balancer (A) is not a transparent bump-in-the-wire and cannot preserve the original destination for inspection. On the transit gateway side, C is the correct routing pattern: the application VPCs' route table holds a static 0.0.0.0/0 pointing at the inspection VPC attachment, while the inspection route table has all VPC attachments propagated so inspected traffic can be forwarded on to its real destination and back; D inverts these and would blackhole traffic. Appliance mode on the inspection VPC attachment is mandatory so the transit gateway keeps both directions of a flow pinned to the same AZ appliance. E uses a single flat route table, which would let VPCs talk directly without inspection."
 },
 {
  "id": "dt-24",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Private NAT Gateway / Direct Connect",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has deployed Amazon EC2 instances in private subnets in a VPC. The EC2 instances must initiate any requests that leave the VPC, including requests to the company's on-premises data center over an AWS Direct Connect connection. No resources outside the VPC can be allowed to open communications directly to the EC2 instances. The on-premises data center's customer gateway is configured with a stateful firewall device that filters for incoming and outgoing requests to and from multiple VPCs. In addition, the company wants to use a single IP match rule to allow all the communications from the EC2 instances to its data center from a single IP address. Which solution will meet these requirements with the LEAST amount of operational overhead?",
  "choices": {
   "A": "Create a VPN connection over the Direct Connect connection by using the on-premises firewall. Use the firewall to block all traffic from on premises to AWS. Allow a stateful connection from the EC2 instances to initiate the requests.",
   "B": "Configure the on-premises firewall to filter all requests from the on-premises network to the EC2 instances. Allow a stateful connection if the EC2 instances in the VPC initiate the traffic.",
   "C": "Deploy a NAT gateway into a private subnet in the VPC where the EC2 instances are deployed. Specify the NAT gateway type as private. Configure the on-premises firewall to allow connections from the IP address that is assigned to the NAT gateway.",
   "D": "Deploy a NAT instance into a private subnet in the VPC where the EC2 instances are deployed. Configure the on-premises firewall to allow connections from the IP address that is assigned to the NAT instance."
  },
  "answer": [
   "C"
  ],
  "explanation": "A private NAT gateway performs source NAT for traffic leaving the VPC toward on-premises networks over Direct Connect or VPN without requiring an internet gateway or an Elastic IP. All EC2 flows are translated to the private NAT gateway's single private IP, which lets the on-premises stateful firewall use one IP match rule, and because NAT is stateful and connection-oriented, only outbound-initiated sessions succeed — nothing on-premises can open a connection directly to the instances. A NAT instance (D) could technically do the same but requires building, patching, scaling, and providing HA for an EC2 appliance, which is far more operational overhead. B relies on firewall rules alone and does not collapse traffic to a single source IP. A adds an unnecessary VPN over Direct Connect and still does not give a single source IP."
 },
 {
  "id": "dt-25",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Transit Gateway / Site-to-Site VPN scaling",
  "difficulty": "medium",
  "multi": false,
  "question": "A global company operates all its non-production environments out of three AWS Regions: eu-west-1, us-east-1, and us-west-1. The company hosts all its production workloads in two on-premises data centers. The company has 60 AWS accounts and each account has two VPCs in each Region. Each VPC has a virtual private gateway where two VPN connections terminate for resilient connectivity to the data centers. The company has 360 VPN tunnels to each data center, resulting in high management overhead. The total VPN throughput for each Region is 500 Mbps. The company wants to migrate the production environments to AWS. The company needs a solution that will simplify the network architecture and allow for future growth. The production environments will generate an additional 2 Gbps of traffic per Region back to the data centers. This traffic will increase over time. Which solution will meet these requirements?",
  "choices": {
   "A": "Set up an AWS Direct Connect connection from each data center to AWS in each Region. Create and attach private VIFs to a single Direct Connect gateway. Attach the Direct Connect gateway to all the VPCs. Remove the existing VPN connections that are attached directly to the virtual private gateways.",
   "B": "Create a single transit gateway with VPN connections from each data center. Share the transit gateway with each account by using AWS Resource Access Manager (AWS RAM). Attach the transit gateway to each VPC. Remove the existing VPN connections that are attached directly to the virtual private gateways.",
   "C": "Create a transit gateway in each Region with multiple newly commissioned VPN connections from each data center. Share the transit gateways with each account by using AWS Resource Access Manager (AWS RAM). In each Region, attach the transit gateway to each VPC. Remove the existing VPN connections that are attached directly to the virtual private gateways.",
   "D": "Peer all the VPCs in each Region to a new VPC in each Region that will function as a centralized transit VPC. Create new VPN connections from each data center to the transit VPCs. Terminate the original VPN connections that are attached to all the original VPCs. Retain the new VPN connection to the new transit VPC in each Region."
  },
  "answer": [
   "C"
  ],
  "explanation": "A transit gateway is a Regional construct, so the only way to consolidate 60 accounts x 2 VPCs per Region is one transit gateway per Region shared through AWS RAM, with each VPC attached to its Regional transit gateway and the Site-to-Site VPNs terminated on the transit gateway instead of on 120 virtual private gateways. That collapses 360 tunnels per data center to a handful and, critically, transit gateway VPN attachments support ECMP across multiple VPN connections, so the company can scale well past the ~1.25 Gbps per-tunnel limit to serve the extra 2 Gbps per Region and grow later. B is wrong because a single transit gateway cannot serve VPCs in three different Regions. A is wrong because a Direct Connect gateway associates with virtual private gateways or transit gateways, not 'all the VPCs' directly, and it ignores the requirement to reduce tunnel sprawl and the fact that a private VIF/DXGW design caps at 20 VGW associations. D re-creates a self-managed transit VPC, and VPC peering is non-transitive so the spokes could not reach the VPN through the transit VPC anyway."
 },
 {
  "id": "dt-26",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Gateway VPC endpoints / cost optimization",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is building its website on AWS in a single VPC. The VPC has public subnets and private subnets in two Availability Zones. The website has static content such as images. The company is using Amazon S3 to store the content. The company has deployed a fleet of Amazon EC2 instances as web servers in a private subnet. The EC2 instances are in an Auto Scaling group behind an Application Load Balancer. The EC2 instances will serve traffic, and they must pull content from an S3 bucket to render the webpages. The company is using AWS Direct Connect with a public VIF for on-premises connectivity to the S3 bucket. A network engineer notices that traffic between the EC2 instances and Amazon S3 is routing through a NAT gateway. As traffic increases, the company's costs are increasing. The network engineer needs to change the connectivity to reduce the NAT gateway costs that result from the traffic between the EC2 instances and Amazon S3. Which solution will meet these requirements?",
  "choices": {
   "A": "Create a Direct Connect private VIF. Migrate the traffic from the public VIF to the private VIF.",
   "B": "Create an AWS Site-to-Site VPN tunnel over the existing public VIF.",
   "C": "Implement interface VPC endpoints for Amazon S3. Update the VPC route table.",
   "D": "Implement gateway VPC endpoints for Amazon S3. Update the VPC route table."
  },
  "answer": [
   "D"
  ],
  "explanation": "A gateway VPC endpoint for Amazon S3 adds a prefix-list route to the private subnet route tables so instance-to-S3 traffic leaves the VPC directly over the AWS network, completely bypassing the NAT gateway. Gateway endpoints carry no hourly charge and no per-GB data processing charge, so both the NAT gateway hourly cost and its per-GB processing cost for S3 traffic disappear. Option C (interface endpoint for S3) would also remove the NAT gateway path but reintroduces per-hour-per-AZ and per-GB PrivateLink charges, so it does not minimize cost for this in-Region, high-volume use case. Option A is irrelevant because a private VIF connects on-premises to VPCs and does not change how EC2 instances reach S3, and it would break the existing public VIF path to S3. Option B adds a VPN tunnel that has nothing to do with intra-Region EC2-to-S3 traffic."
 },
 {
  "id": "dt-27",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Transit Gateway Network Manager",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants to improve visibility into its AWS environment. The AWS environment consists of multiple VPCs that are connected to a transit gateway. The transit gateway connects to an on-premises data center through an AWS Direct Connect gateway and a pair of redundant Direct Connect connections that use transit VIFs. The company must receive notification each time a new route is advertised to AWS from on premises over Direct Connect. What should a network engineer do to meet these requirements?",
  "choices": {
   "A": "Enable Amazon CloudWatch metrics on Direct Connect to track the received routes. Configure a CloudWatch alarm to send notifications when routes change.",
   "B": "Onboard Transit Gateway Network Manager to Amazon CloudWatch Logs Insights. Use Amazon EventBridge (Amazon CloudWatch Events) to send notifications when routes change.",
   "C": "Configure an AWS Lambda function to periodically check the routes on the Direct Connect gateway and to send notifications when routes change.",
   "D": "Enable Amazon CloudWatch Logs on the transit VIFs to track the received routes. Create a metric filter Set an alarm on the filter to send notifications when routes change."
  },
  "answer": [
   "B"
  ],
  "explanation": "AWS Transit Gateway Network Manager tracks the global network topology and publishes route and topology change events to Amazon EventBridge, so an EventBridge rule can fire an SNS notification whenever a new prefix is advertised from on premises over the transit VIF, and the route data can also be inspected in CloudWatch Logs Insights. Direct Connect CloudWatch metrics (A) cover connection state, bits/packets per second, light levels, and BGP peer state, but there is no metric that enumerates received prefixes. There are no CloudWatch Logs published by a transit VIF (D), so a metric filter has nothing to match. A Lambda polling loop (C) would work mechanically but is custom code with polling latency and ongoing maintenance, which is not the AWS-native answer."
 },
 {
  "id": "dt-28",
  "source": "ditectrev",
  "domain": 4,
  "topic": "Direct Connect MACsec",
  "difficulty": "medium",
  "multi": false,
  "question": "A software company offers a software-as-a-service (SaaS) accounting application that is hosted in the AWS Cloud The application requires connectivity to the company's on-premises network. The company has two redundant 10 GB AWS Direct Connect connections between AWS and its on-premises network to accommodate the growing demand for the application. The company already has encryption between its on-premises network and the colocation. The company needs to encrypt traffic between AWS and the edge routers in the colocation within the next few months. The company must maintain its current bandwidth. What should a network engineer do to meet these requirements with the LEAST operational overhead?",
  "choices": {
   "A": "Deploy a new public VIF with encryption on the existing Direct Connect connections. Reroute traffic through the new public VIF.",
   "B": "Create a virtual private gateway Deploy new AWS Site-to-Site VPN connections from on premises to the virtual private gateway Reroute traffic from the Direct Connect private VIF to the new VPNs.",
   "C": "Deploy a new pair of 10 GB Direct Connect connections with MACsec. Configure MACsec on the edge routers. Reroute traffic to the new Direct Connect connections. Decommission the original Direct Connect connections.",
   "D": "Deploy a new pair of 10 GB Direct Connect connections with MACsec. Deploy a new public VIF on the new Direct Connect connections. Deploy two AWS Site-to-Site VPN connections on top of the new public VIF. Reroute traffic from the existing private VIF to the new Site-to-Site connections. Decommission the original Direct Connect connections."
  },
  "answer": [
   "C"
  ],
  "explanation": "MACsec delivers hardware-based, line-rate encryption on dedicated 10 Gbps Direct Connect connections between the customer's colocation edge router and the AWS Direct Connect endpoint, which is exactly the segment the company still needs to protect. Because encryption happens in the physical layer hardware, the pair of 10 GB connections retains full bandwidth and requires only a MACsec CKN/CAK key configuration on both ends - the least operational overhead of the options (C). A is fictional: there is no 'encryption' option on a public VIF, and VIF types do not encrypt traffic. B and D route production traffic over IPsec Site-to-Site VPN tunnels capped at about 1.25 Gbps each, so the company would lose the vast majority of its 20 Gbps of aggregate capacity, and D layers VPN on top of a new MACsec circuit for no benefit while adding tunnel management overhead."
 },
 {
  "id": "dt-29",
  "source": "ditectrev",
  "domain": 4,
  "topic": "ALB Access Logs / Athena",
  "difficulty": "easy",
  "multi": false,
  "question": "A company hosts an application on Amazon EC2 instances behind an Application Load Balancer (ALB). The company recently experienced a network security breach. A network engineer must collect and analyze logs that include the client IP address, target IP address, target port, and user agent of each user that accesses the application. What is the MOST operationally efficient solution that meets these requirements?",
  "choices": {
   "A": "Configure the ALB to store logs in an Amazon S3 bucket. Download the files from Amazon S3, and use a spreadsheet application to analyze the logs.",
   "B": "Configure the ALB to push logs to Amazon Kinesis Data Streams. Use Amazon Kinesis Data Analytics to analyze the logs.",
   "C": "Configure Amazon Kinesis Data Streams to stream data from the ALB to Amazon OpenSearch Service (Amazon Elasticsearch Service). Use search operations in Amazon OpenSearch Service (Amazon Elasticsearch Service) to analyze the data.",
   "D": "Configure the ALB to store logs in an Amazon S3 bucket. Use Amazon Athena to analyze the logs in Amazon S3."
  },
  "answer": [
   "D"
  ],
  "explanation": "ALB access logs capture exactly the requested fields — client:port, target:port, request URL, and user_agent — and are delivered as compressed files to Amazon S3. Amazon Athena can query those logs in place with SQL using the documented ALB log table definition and partition projection, requiring no ingestion pipeline or servers, which makes D the most operationally efficient. A collects the right data but downloading and using a spreadsheet does not scale and is manual. B is not possible: ALB access logs can only be delivered to S3, not pushed natively to Kinesis Data Streams. C likewise assumes a non-existent native ALB-to-Kinesis stream and adds an OpenSearch cluster to manage."
 },
 {
  "id": "dt-30",
  "source": "ditectrev",
  "domain": 4,
  "topic": "CloudFront/ALB TLS in transit",
  "difficulty": "medium",
  "multi": true,
  "question": "A media company is implementing a news website for a global audience. The website uses Amazon CloudFront as its content delivery network. The backend runs on Amazon EC2 Windows instances behind an Application Load Balancer (ALB). The instances are part of an Auto Scaling group. The company's customers access the website by using service example com as the CloudFront custom domain name. The CloudFront origin points to an ALB that uses service-alb.example.com as the domain name. The company's security policy requires the traffic to be encrypted in transit at all times between the users and the backend. Which combination of changes must the company make to meet this security requirement? (Choose three.)",
  "choices": {
   "A": "Create a self-signed certificate for service.example.com. Import the certificate into AWS Certificate Manager (ACM). Configure CloudFront to use this imported SSL/TLS certificate. Change the default behavior to redirect HTTP to HTTPS.",
   "B": "Create a certificate for service.example.com by using AWS Certificate Manager (ACM). Configure CloudFront to use this custom SSL/TLS certificate. Change the default behavior to redirect HTTP to HTTPS.",
   "C": "Create a certificate with any domain name by using AWS Certificate Manager (ACM) for the EC2 instances. Configure the backend to use this certificate for its HTTPS listener. Specify the instance target type during the creation of a new target group that uses the HTTPS protocol for its targets. Attach the existing Auto Scaling group to this new target group.",
   "D": "Create a public certificate from a third-party certificate provider with any domain name for the EC2 instances. Configure the backend to use this certificate for its HTTPS listener. Specify the instance target type during the creation of a new target group that uses the HTTPS protocol for its targets. Attach the existing Auto Scaling group to this new target group.",
   "E": "Create a certificate for service-alb.example.com by using AWS Certificate Manager (ACM). On the ALB add a new HTTPS listener that uses the new target group and the service-alb.example.com ACM certificate. Modify the CloudFront origin to use the HTTPS protocol only. Delete the HTTP listener on the ALB.",
   "F": "Create a self-signed certificate for service-alb.example.com. Import the certificate into AWS Certificate Manager (ACM). On the ALB add a new HTTPS listener that uses the new target group and the imported service-alb.example.com ACM certificate. Modify the CloudFront origin to use the HTTPS protocol only. Delete the HTTP listener on the ALB."
  },
  "answer": [
   "B",
   "D",
   "E"
  ],
  "explanation": "End-to-end encryption requires three hops to be TLS: viewer to CloudFront, CloudFront to ALB, and ALB to the EC2 targets. B provides a public ACM certificate for service.example.com in us-east-1 for the distribution plus an HTTP-to-HTTPS redirect, which secures the viewer hop; A fails because CloudFront rejects self-signed/untrusted certificates for viewer-facing custom SSL. E secures the CloudFront-to-ALB hop with a publicly trusted ACM certificate on an ALB HTTPS listener and forces the origin protocol policy to HTTPS only; F fails because CloudFront validates the origin certificate chain against trusted CAs and will reject a self-signed ALB certificate. D secures the ALB-to-instance hop: the ALB does not validate the target's certificate, so any certificate works, but it must actually be installable on the instances - which rules out C, since a standard ACM public certificate is issued only for domains you validate and cannot be installed on EC2 in this way, making a third-party certificate the workable choice."
 },
 {
  "id": "dt-31",
  "source": "ditectrev",
  "domain": 3,
  "topic": "NLB Availability Zones",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is hosting an application on Amazon EC2 instances behind a Network Load Balancer (NLB). A solutions architect added EC2 instances in a second Availability Zone to improve the availability of the application. The solutions architect added the instances to the NLB target group. The company's operations team notices that traffic is being routed only to the instances in the first Availability Zone. What is the MOST operationally efficient solution to resolve this issue?",
  "choices": {
   "A": "Enable the new Availability Zone on the NLB.",
   "B": "Create a new NLB for the instances in the second Availability Zone.",
   "C": "Enable proxy protocol on the NLB.",
   "D": "Create a new target group with the instances in both Availability Zones."
  },
  "answer": [
   "A"
  ],
  "explanation": "A Network Load Balancer only sends traffic to targets in Availability Zones that have been explicitly enabled through subnet mappings, and an AZ cannot be added at creation time only - it must be enabled on the existing NLB. Adding instances to the target group in a new AZ therefore has no effect until that AZ's subnet is enabled on the load balancer, which is the single-step, most operationally efficient fix. Note that NLB cross-zone load balancing is off by default, so even after enabling the AZ, traffic is distributed per-zone via the zonal DNS records unless cross-zone is turned on. Option B doubles the infrastructure and DNS complexity for no reason, option C (proxy protocol v2) only affects how client connection metadata is passed to targets, and option D is unnecessary because the existing target group already contains the instances - the target group was never the problem."
 },
 {
  "id": "dt-32",
  "source": "ditectrev",
  "domain": 2,
  "topic": "EC2 ENI and BYOIP with Auto Scaling",
  "difficulty": "hard",
  "multi": false,
  "question": "A network engineer needs to set up an Amazon EC2 Auto Scaling group to run a Linux-based network appliance in a highly available architecture. The network engineer is configuring the new launch template for the Auto Scaling group. In addition to the primary network interface the network appliance requires a second network interface that will be used exclusively by the application to exchange traffic with hosts over the internet. The company has set up a Bring Your Own IP (BYOIP) pool that includes an Elastic IP address that should be used as the public IP address for the second network interface. How can the network engineer implement the required architecture?",
  "choices": {
   "A": "Configure the two network interfaces in the launch template. Define the primary network interface to be created in one of the private subnets. For the second network interface, select one of the public subnets. Choose the BYOIP pool ID as the source of public IP addresses.",
   "B": "Configure the primary network interface in a private subnet in the launch template. Use the user data option to run a cloud-init script after boot to attach the second network interface from a subnet with auto-assign public IP addressing enabled.",
   "C": "Create an AWS Lambda function to run as a lifecycle hook of the Auto Scaling group when an instance is launching. In the Lambda function, assign a network interface to an AWS Global Accelerator endpoint.",
   "D": "During creation of the Auto Scaling group, select subnets for the primary network interface. Use the user data option to run a cloud-init script to allocate a second network interface and to associate an Elastic IP address from the BYOIP pool."
  },
  "answer": [
   "D"
  ],
  "explanation": "A launch template can define multiple network interfaces, but it cannot associate an Elastic IP address, let alone one drawn from a specific BYOIP address pool, with a secondary ENI; auto-assign public IP is also only supported for a single-interface instance. The workable pattern is to let the Auto Scaling group create the instance with its primary interface in the selected subnets and then run a cloud-init/user-data script that calls CreateNetworkInterface, AttachNetworkInterface, AllocateAddress with the BYOIP pool, and AssociateAddress against the second interface (D). A fails because the launch template UI/API offers no BYOIP pool selection for a secondary ENI and public IP auto-assign is disabled once a second interface exists. B fails for the same auto-assign restriction and never uses the BYOIP pool. C is nonsense because Global Accelerator endpoints are ALBs, NLBs, EC2 instances, or EIPs, and attaching an ENI to an accelerator is not an operation that exists."
 },
 {
  "id": "dt-33",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Route 53 split-view DNS",
  "difficulty": "hard",
  "multi": true,
  "question": "A company delivers applications over the internet. An Amazon Route 53 public hosted zone is the authoritative DNS service for the company and its internet applications, all of which are offered from the same domain name. A network engineer is working on a new version of one of the applications. All the application's components are hosted in the AWS Cloud. The application has a three-tier design. The front end is delivered through Amazon EC2 instances that are deployed in public subnets with Elastic IP addresses assigned. The backend components are deployed in private subnets from RFC1918. Components of the application need to be able to access other components of the application within the application's VPC by using the same host names as the host names that are used over the public internet. The network engineer also needs to accommodate future DNS changes, such as the introduction of new host names or the retirement of DNS entries. Which combination of steps will meet these requirements? (Choose three.)",
  "choices": {
   "A": "Add a geoproximity routing policy in Route 53.",
   "B": "Create a Route 53 private hosted zone for the same domain name Associate the application's VPC with the new private hosted zone.",
   "C": "Enable DNS hostnames for the application's VPC.",
   "D": "Create entries in the private hosted zone for each name in the public hosted zone by using the corresponding private IP addresses.",
   "E": "Create an Amazon EventBridge (Amazon CloudWatch Events) rule that runs when AWS CloudTrail logs a Route 53 API call to the public hosted zone. Create an AWS Lambda function as the target of the rule. Configure the function to use the event information to update the private hosted zone.",
   "F": "Add the private IP addresses in the existing Route 53 public hosted zone."
  },
  "answer": [
   "B",
   "C",
   "D"
  ],
  "explanation": "This is classic split-view (split-horizon) DNS: create a Route 53 private hosted zone with the same name as the public zone and associate it with the application VPC (B), then populate it with records that map the same host names to the private RFC1918 addresses (D). Route 53 Resolver in the VPC always prefers the associated private hosted zone over the public zone for matching names, so in-VPC components resolve each other privately while internet clients keep getting the public answers. Enabling DNS hostnames (and DNS support) on the VPC (C) is a prerequisite - a private hosted zone will not be used for resolution unless both VPC DNS attributes are enabled. F is dangerous because it would publish internal RFC1918 addresses to the internet, and A (geoproximity routing) does not distinguish VPC-internal from internet queries. E looks attractive for 'future changes' but is the wrong mechanism: it would copy the public zone's public/Elastic IP values into the private zone rather than the private addresses the backend tiers actually need, and it adds a fragile CloudTrail/Lambda pipeline where simply maintaining records in both zones suffices."
 },
 {
  "id": "dt-34",
  "source": "ditectrev",
  "domain": 1,
  "topic": "PrivateLink / NLB with ECS Fargate",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is deploying an application. The application is implemented in a series of containers in an Amazon Elastic Container Service (Amazon ECS) cluster. The company will use the Fargate launch type for its tasks. The containers will run workloads that require connectivity initiated over an SSL connection. Traffic must be able to flow to the application from other AWS accounts over private connectivity. The application must scale in a manageable way as more consumers use the application. Which solution will meet these requirements?",
  "choices": {
   "A": "Choose a Gateway Load Balancer (GLB) as the type of load balancer for the ECS service. Create a lifecycle hook to add new tasks to the target group from Amazon ECS as required to handle scaling. Specify the GLB in the service definition. Create a VPC peer for external AWS accounts. Update the route tables so that the AWS accounts can reach the GLB.",
   "B": "Choose an Application Load Balancer (ALB) as the type of load balancer for the ECS service. Create path-based routing rules to allow the application to target the containers that are registered in the target group. Specify the ALB in the service definition. Create a VPC endpoint service for the ALB Share the VPC endpoint service with other AWS accounts.",
   "C": "Choose an Application Load Balancer (ALB) as the type of load balancer for the ECS service. Create path-based routing rules to allow the application to target the containers that are registered in the target group. Specify the ALB in the service definition. Create a VPC peer for the external AWS accounts. Update the route tables so that the AWS accounts can reach the ALB.",
   "D": "Choose a Network Load Balancer (NLB) as the type of load balancer for the ECS service. Specify the NLB in the service definition. Create a VPC endpoint service for the NLB. Share the VPC endpoint service with other AWS accounts."
  },
  "answer": [
   "D"
  ],
  "explanation": "Cross-account private access to a service is delivered with AWS PrivateLink, and a VPC endpoint service can only be fronted by a Network Load Balancer or Gateway Load Balancer — not by an ALB directly. An NLB is also the right choice for connections that are initiated as raw SSL/TLS at layer 4, and it integrates natively with ECS Fargate services using IP-mode target groups that register and deregister task ENIs automatically as the service scales. That makes D correct. B fails because you cannot create an endpoint service directly on an ALB (the supported pattern requires an NLB in front of the ALB). A misuses Gateway Load Balancer, which is for transparent inline appliance insertion using GENEVE, and C relies on VPC peering, which grants broad network access and does not scale as consumer accounts grow."
 },
 {
  "id": "dt-35",
  "source": "ditectrev",
  "domain": 1,
  "topic": "PrivateLink / VPC endpoint services",
  "difficulty": "medium",
  "multi": false,
  "question": "A company's development team has created a new product recommendation web service. The web service is hosted in a VPC with a CIDR block of 192.168.224.0/19. The company has deployed the web service on Amazon EC2 instances and has configured an Auto Scaling group as the target of a Network Load Balancer (NLB). The company wants to perform testing to determine whether users who receive product recommendations spend more money than users who do not receive product recommendations. The company has a big sales event in 5 days and needs to integrate its existing production environment with the recommendation engine by then. The existing production environment is hosted in a VPC with a CIDR block of 192.168.128 0/17. A network engineer must integrate the systems by designing a solution that results in the least possible disruption to the existing environments. Which solution will meet these requirements?",
  "choices": {
   "A": "Create a VPC peering connection between the web service VPC and the existing production VPC. Add a routing rule to the appropriate route table to allow data to flow to 192.168.224.0/19 from the existing production environment and to flow to 192.168.128.0/17 from the web service environment. Configure the relevant security groups and ACLs to allow the systems to communicate.",
   "B": "Ask the development team of the web service to redeploy the web service into the production VPC and integrate the systems there.",
   "C": "Create a VPC endpoint service. Associate the VPC endpoint service with the NLB for the web service. Create an interface VPC endpoint for the web service in the existing production VPC.",
   "D": "Create a transit gateway in the existing production environment. Create attachments to the production VPC and the web service VPC. Configure appropriate routing rules in the transit gateway and VPC route tables for 192.168.224.0/19 and 192.168.128.0/17. Configure the relevant security groups and ACLs to allow the systems to communicate."
  },
  "answer": [
   "C"
  ],
  "explanation": "The key detail is that 192.168.224.0/19 is contained inside 192.168.128.0/17, so the two VPC CIDR blocks overlap. VPC peering (A) and transit gateway attachments (D) both refuse overlapping CIDR blocks, so neither can be created. AWS PrivateLink is the only connectivity model that works with overlapping address space, because the consumer VPC reaches the service through an elastic network interface with an IP from the consumer's own subnet and no routes between the VPCs are required. Fronting the existing NLB with a VPC endpoint service and creating an interface endpoint in the production VPC also causes zero change to the running production environment, satisfying the 5-day, least-disruption constraint. B would require redeploying and retesting the whole web service, which is the most disruptive option."
 },
 {
  "id": "dt-36",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect / IPv6 hybrid connectivity",
  "difficulty": "hard",
  "multi": false,
  "question": "A network engineer needs to update a company's hybrid network to support IPv6 for the upcoming release of a new application. The application is hosted in a VPC in the AWS Cloud. The company's current AWS infrastructure includes VPCs that are connected by a transit gateway. The transit gateway is connected to the on-premises network by AWS Direct Connect and AWS Site-to-Site VPN. The company's on-premises devices have been updated to support the new IPv6 requirements. The company has enabled IPv6 for the existing VPC by assigning a new IPv6 CIDR block to the VPC and by assigning IPv6 to the subnets for dual-stack support. The company has launched new Amazon EC2 instances for the new application in the updated subnets. When updating the hybrid network to support IPv6 the network engineer must avoid making any changes to the current infrastructure. The network engineer also must block direct access to the instances' new IPv6 addresses from the internet. However, the network engineer must allow outbound internet access from the instances. What is the MOST operationally efficient solution that meets these requirements?",
  "choices": {
   "A": "Update the Direct Connect transit VIF and configure BGP peering with the AWS assigned IPv6 peering address. Create a new VPN connection that supports IPv6 connectivity. Add an egress-only internet gateway. Update any affected VPC security groups and route tables to provide connectivity within the VPC and between the VPC and the on-premises devices.",
   "B": "Update the Direct Connect transit VIF and configure BGP peering with the AWS assigned IPv6 peering address. Update the existing VPN connection to support IPv6 connectivity. Add an egress-only internet gateway. Update any affected VPC security groups and route tables to provide connectivity within the VPC and between the VPC and the on-premises devices.",
   "C": "Create a Direct Connect transit VIF and configure BGP peering with the AWS assigned IPv6 peering address. Create a new VPN connection that supports IPv6 connectivity. Add an egress-only internet gateway. Update any affected VPC security groups and route tables to provide connectivity within the VPC and between the VPC and the on-premises devices.",
   "D": "Create a Direct Connect transit VIF and configure BGP peering with the AWS assigned IPv6 peering address. Create a new VPN connection that supports IPv6 connectivity. Add a NAT gateway. Update any affected VPC security groups and route tables to provide connectivity within the VPC and between the VPC and the on-premises devices."
  },
  "answer": [
   "A"
  ],
  "explanation": "A Direct Connect virtual interface supports separate IPv4 and IPv6 BGP peerings on the same VIF, so the existing transit VIF is updated with an additional BGP peer using the AWS-assigned /125 IPv6 peering addresses - no new VIF and no disruption to existing traffic, which satisfies the 'avoid changes to current infrastructure' constraint (ruling out C and D, which create a new transit VIF). AWS Site-to-Site VPN, by contrast, has its inner IP version fixed at creation time and cannot be changed on an existing connection, so a new IPv6-capable VPN connection must be created (ruling out B). An egress-only internet gateway is the IPv6 equivalent of a NAT gateway for outbound-only access: it is stateful, allows instance-initiated outbound IPv6 traffic, and blocks all inbound connections from the internet. Option D's NAT gateway is an IPv4 construct (NAT64 only translates IPv6 clients to IPv4 destinations) and does not provide outbound IPv6 internet access."
 },
 {
  "id": "dt-37",
  "source": "ditectrev",
  "domain": 4,
  "topic": "ALB TLS security policy",
  "difficulty": "medium",
  "multi": false,
  "question": "A network engineer must provide additional safeguards to protect encrypted data at Application Load Balancers (ALBs) through the use of a unique random session key. What should the network engineer do to meet this requirement?",
  "choices": {
   "A": "Change the ALB security policy to a policy that supports TLS 1.2 protocol only.",
   "B": "Use AWS Key Management Service (AWS KMS) to encrypt session keys.",
   "C": "Associate an AWS WAF web ACL with the ALBs. and create a security rule to enforce forward secrecy (FS).",
   "D": "Change the ALB security policy to a policy that supports forward secrecy (FS)."
  },
  "answer": [
   "D"
  ],
  "explanation": "A unique random session key per connection that cannot be recovered later even if the server's private key is compromised is the definition of forward secrecy, which is delivered by ephemeral Diffie-Hellman key exchange (ECDHE/DHE) cipher suites. On an Application Load Balancer, the cipher suites offered are controlled by the listener's security policy, so selecting an FS-supporting policy (for example the ELBSecurityPolicy-FS-* series) is the correct action. Choosing a TLS 1.2-only policy (A) constrains the protocol version but does not by itself guarantee that only ephemeral key-exchange ciphers are negotiated. AWS KMS (B) manages keys for data encryption and has no role in the TLS handshake on an ALB, and AWS WAF (C) inspects Layer 7 request content after decryption and cannot influence cipher negotiation."
 },
 {
  "id": "dt-38",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Transit Gateway Connect / SD-WAN",
  "difficulty": "hard",
  "multi": false,
  "question": "A company has deployed a software-defined WAN (SD-WAN) solution to interconnect all of its offices. The company is migrating workloads to AWS and needs to extend its SD-WAN solution to support connectivity to these workloads. A network engineer plans to deploy AWS Transit Gateway Connect and two SD-WAN virtual appliances to provide this connectivity. According to company policies, only a single SD-WAN virtual appliance can handle traffic from AWS workloads at a given time. How should the network engineer configure routing to meet these requirements?",
  "choices": {
   "A": "Add a static default route in the transit gateway route table to point to the secondary SD-WAN virtual appliance. Add routes that are more specific to point to the primary SD-WAN virtual appliance.",
   "B": "Configure the BGP community tag 7224:7300 on the primary SD-WAN virtual appliance for BGP routes toward the transit gateway.",
   "C": "Configure the AS_PATH prepend attribute on the secondary SD-WAN virtual appliance for BGP routes toward the transit gateway.",
   "D": "Disable equal-cost multi-path (ECMP) routing on the transit gateway for Transit Gateway Connect."
  },
  "answer": [
   "C"
  ],
  "explanation": "Transit Gateway Connect peers exchange routes with the SD-WAN appliances over BGP (inside GRE tunnels), and the transit gateway performs ECMP across Connect peers that advertise the same prefix with equal path attributes. To force a single active appliance, the secondary appliance must advertise a less-preferred path, and AS_PATH prepending is the supported BGP attribute for that - the transit gateway then installs only the primary's shorter AS_PATH route and automatically fails over to the secondary if the primary's BGP session drops (C). B is wrong because 7224:7300 is a Direct Connect local-preference community that has no meaning on a Transit Gateway Connect BGP session. D is not a real control: there is no per-attachment toggle to disable ECMP for Connect attachments, and even if traffic stopped load balancing it would not determine which appliance is preferred. A is backwards and mixes static routes with dynamically learned Connect peer routes, which would send most traffic to the wrong appliance."
 },
 {
  "id": "dt-39",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Transit Gateway Connect",
  "difficulty": "hard",
  "multi": false,
  "question": "A company is planning to deploy many software-defined WAN (SD-WAN) sites. The company is using AWS Transit Gateway and has deployed a transit gateway in the required AWS Region. A network engineer needs to deploy the SD-WAN hub virtual appliance into a VPC that is connected to the transit gateway. The solution must support at least 5 Gbps of throughput from the SD-WAN hub virtual appliance to other VPCs that are attached to the transit gateway. Which solution will meet these requirements?",
  "choices": {
   "A": "Create a new VPC for the SD-WAN hub virtual appliance. Create two IPsec VPN connections between the SD-WAN hub virtual appliance and the transit gateway. Configure BGP over the IPsec VPN connections.",
   "B": "Assign a new CIDR block to the transit gateway. Create a new VPC for the SD-WAN hub virtual appliance. Attach the new VPC to the transit gateway with a VPC attachment. Add a transit gateway Connect attachment. Create a Connect peer and specify the GRE and BGP parameters. Create a route in the appropriate VPC for the SD-WAN hub virtual appliance to route to the transit gateway.",
   "C": "Create a new VPC for the SD-WAN hub virtual appliance. Attach the new VPC to the transit gateway with a VPC attachment. Create two IPsec VPN connections between the SD-WAN hub virtual appliance and the transit gateway. Configure BGP over the IPsec VPN connections.",
   "D": "Assign a new CIDR block to the transit gateway. Create a new VPC for the SD-WAN hub virtual appliance. Attach the new VPC to the transit gateway with a VPC attachment. Add a transit gateway Connect attachment. Create a Connect peer and specify the VXLAN and BGP parameters. Create a route in the appropriate VPC for the SD-WAN hub virtual appliance to route to the transit gateway."
  },
  "answer": [
   "B"
  ],
  "explanation": "Transit Gateway Connect provides a GRE-based attachment with BGP peering over an existing VPC (or Direct Connect) attachment and supports up to 5 Gbps per Connect peer (and up to 20 Gbps per Connect attachment with multiple peers), which meets the throughput requirement. Creating a Connect attachment requires a transit gateway CIDR block, from which the GRE tunnel inside/peer addresses are allocated. B describes this correctly — VPC attachment, Connect attachment, Connect peer with GRE and BGP parameters. D is wrong because Transit Gateway Connect uses GRE encapsulation, not VXLAN. A and C rely on IPsec Site-to-Site VPN attachments, which are limited to roughly 1.25 Gbps per tunnel; even with ECMP across two tunnels they fall short of 5 Gbps, and A additionally omits any VPC attachment to reach the appliance."
 },
 {
  "id": "dt-40",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Transit Gateway multicast",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is deploying a new application on AWS. The application uses dynamic multicasting. The company has five VPCs that are all attached to a transit gateway Amazon EC2 instances in each VPC need to be able to register dynamically to receive a multicast transmission. How should a network engineer configure the AWS resources to meet these requirements?",
  "choices": {
   "A": "Create a static source multicast domain within the transit gateway. Associate the VPCs and applicable subnets with the multicast domain. Register the multicast senders' network interface with the multicast domain. Adjust the network ACLs to allow UDP traffic from the source to all receivers and to allow UDP traffic that is sent to the multicast group address.",
   "B": "Create a static source multicast domain within the transit gateway. Associate the VPCs and applicable subnets with the multicast domain. Register the multicast senders' network interface with the multicast domain. Adjust the network ACLs to allow TCP traffic from the source to all receivers and to allow TCP traffic that is sent to the multicast group address.",
   "C": "Create an Internet Group Management Protocol (IGMP) multicast domain within the transit gateway. Associate the VPCs and applicable subnets with the multicast domain. Register the multicast senders' network interface with the multicast domain. Adjust the network ACLs to allow UDP traffic from the source to all receivers and to allow UDP traffic that is sent to the multicast group address.",
   "D": "Create an Internet Group Management Protocol (IGMP) multicast domain within the transit gateway. Associate the VPCs and applicable subnets with the multicast domain. Register the multicast senders' network interface with the multicast domain. Adjust the network ACLs to allow TCP traffic from the source to all receivers and to allow TCP traffic that is sent to the multicast group address."
  },
  "answer": [
   "C"
  ],
  "explanation": "Transit Gateway multicast domains come in two flavors: static-source, where you explicitly register group members with the API, and IGMPv2-enabled domains, where instances dynamically join and leave groups by sending IGMP membership reports that the transit gateway snoops. Because the requirement is that instances 'register dynamically' to receive the transmission, an IGMP multicast domain is required, eliminating A and B. Multicast is carried over UDP - there is no such thing as TCP multicast - so the network ACLs must permit UDP to the receivers and to the multicast group address, eliminating B and D. Note that IGMP also requires the domain to have IGMPv2 support enabled and the subnets in each participating VPC to be associated with the multicast domain, exactly as C describes."
 },
 {
  "id": "dt-41",
  "source": "ditectrev",
  "domain": 1,
  "topic": "ALB path-based routing",
  "difficulty": "easy",
  "multi": true,
  "question": "A company is creating new features for its ecommerce website. These features will use several microservices that are accessed through different paths. The microservices will run on Amazon Elastic Container Service (Amazon ECS). The company requires the use of HTTPS for all of its public websites. The application requires the customer's source IP addresses. A network engineer must implement a load balancing strategy that meets these requirements. Which combination of actions should the network engineer take to accomplish this goal? (Choose two.)",
  "choices": {
   "A": "Use a Network Load Balancer.",
   "B": "Retrieve client IP addresses by using the X-Forwarded-For header.",
   "C": "Retrieve client IP addresses by using the X-IP-Source header.",
   "D": "Use AWS App Mesh load balancing.",
   "E": "Use an Application Load Balancer."
  },
  "answer": [
   "B",
   "E"
  ],
  "explanation": "Path-based routing to multiple microservices plus HTTPS termination is exactly the Layer 7 feature set of an Application Load Balancer, which supports listener rules matching on URL path and forwarding to different ECS target groups, along with ACM certificates for TLS. Because the ALB terminates the connection and opens a new one to the target, the original client IP is preserved in the X-Forwarded-For HTTP header, which the application reads to obtain the customer's source IP. Option A (NLB) preserves the source IP at Layer 4 but cannot do path-based routing to different microservices or HTTP-level TLS handling with rules. Option C invents a header that does not exist, and option D describes a service mesh for east-west traffic between services, not a public HTTPS entry point."
 },
 {
  "id": "dt-42",
  "source": "ditectrev",
  "domain": 1,
  "topic": "VPC peering vs Transit Gateway cost",
  "difficulty": "hard",
  "multi": false,
  "question": "A company is migrating its containerized application to AWS. For the architecture the company will have an ingress VPC with a Network Load Balancer (NLB) to distribute the traffic to front-end pods in an Amazon Elastic Kubernetes Service (Amazon EKS) cluster. The front end of the application will determine which user is requesting access and will send traffic to 1 of 10 services VPCs. Each services VPC will include an NLB that distributes traffic to the services pods in an EKS cluster. The company is concerned about overall cost. User traffic will be responsible for more than 10 TB of data transfer from the ingress VPC to services VPCs every month. A network engineer needs to recommend how to design the communication between the VPCs. Which solution will meet these requirements at the LOWEST cost?",
  "choices": {
   "A": "Create a transit gateway. Peer each VPC to the transit gateway. Use zonal DNS names for the NLB in the services VPCs to minimize cross-AZ traffic from the ingress VPC to the services VPCs.",
   "B": "Create an AWS PrivateLink endpoint in every Availability Zone in the ingress VPC. Each PrivateLink endpoint will point to the zonal DNS entry of the NLB in the services VPCs.",
   "C": "Create a VPC peering connection between the ingress VPC and each of the 10 services VPCs. Use zonal DNS names for the NLB in the services VPCs to minimize cross-AZ traffic from the ingress VPC to the services VPCs.",
   "D": "Create a transit gateway. Peer each VPC to the transit gateway. Turn off cross-AZ load balancing on the transit gateway. Use Regional DNS names for the NLB in the services VPCs."
  },
  "answer": [
   "C"
  ],
  "explanation": "VPC peering carries no hourly attachment fee and no per-GB data processing charge, so for over 10 TB per month the only cost is data transfer, and using zonal NLB DNS names keeps flows within the same Availability Zone, where intra-Region peering traffic is free. A transit gateway (A and D) adds an hourly charge per attachment plus roughly $0.02 per GB of data processed, which on 10+ TB per month across 11 attachments is by far the most expensive option; D also invents a nonexistent 'cross-AZ load balancing' setting on a transit gateway and Regional NLB names would add cross-AZ charges. PrivateLink (B) charges both an hourly fee per endpoint per AZ and a per-GB processing fee, so ten services multiplied by three AZs makes it costlier than peering. With only 11 VPCs in a hub-and-spoke pattern, the 10 peering connections from the ingress VPC remain manageable and well within limits."
 },
 {
  "id": "dt-43",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Transit Gateway appliance mode",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has stateful security appliances that are deployed to multiple Availability Zones in a centralized shared services VPC. The AWS environment includes a transit gateway that is attached to application VPCs and the shared services VPC. The application VPCs have workloads that are deployed in private subnets across multiple Availability Zones. The stateful appliances in the shared services VPC inspect all east west (VPC-to-VPC) traffic. Users report that inter-VPC traffic to different Availability Zones is dropping. A network engineer verified this claim by issuing Internet Control Message Protocol (ICMP) pings between workloads in different Availability Zones across the application VPCs. The network engineer has ruled out security groups, stateful device configurations and network ACLs as the cause of the dropped traffic. What is causing the traffic to drop?",
  "choices": {
   "A": "The stateful appliances and the transit gateway attachments are deployed in a separate subnet in the shared services VPC.",
   "B": "Appliance mode is not enabled on the transit gateway attachment to the shared services VPC.",
   "C": "The stateful appliances and the transit gateway attachments are deployed in the same subnet in the shared services VPC.",
   "D": "Appliance mode is not enabled on the transit gateway attachment to the application VPCs."
  },
  "answer": [
   "B"
  ],
  "explanation": "By default a transit gateway keeps traffic in the Availability Zone it arrived in - it selects the attachment ENI in the source AZ - which means the forward and return directions of a cross-AZ flow can be handed to appliances in different Availability Zones. Stateful appliances then see only one direction of the flow and drop it, which matches the symptom that only inter-AZ traffic fails. Enabling appliance mode on the transit gateway VPC attachment for the shared services (inspection) VPC makes the transit gateway use a consistent flow hash so both directions of a flow are always sent to the same appliance ENI (B). D is wrong because appliance mode is only meaningful, and only needs to be enabled, on the attachment for the VPC that hosts the appliances. A and C describe subnet placement: while it is a best practice to put transit gateway attachment ENIs in dedicated subnets, neither placement causes or fixes asymmetric cross-AZ routing."
 },
 {
  "id": "dt-44",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Transit Gateway Appliance Mode",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has hundreds of Amazon EC2 instances that are running in two production VPCs across all Availability Zones in the us-east-1 Region. The production VPCs are named VPC A and VPC B. A new security regulation requires all traffic between production VPCs to be inspected before the traffic is routed to its final destination. The company deploys a new shared VPC that contains a stateful firewall appliance and a transit gateway with a VPC attachment across all VPCs to route traffic between VPC A and VPC B through the firewall appliance for inspection. During testing, the company notices that the transit gateway is dropping the traffic whenever the traffic is between two Availability Zones. What should a network engineer do to fix this issue with the LEAST management overhead?",
  "choices": {
   "A": "In the shared VPC, replace the VPC attachment with a VPN attachment. Create a VPN tunnel between the transit gateway and the firewall appliance. Configure BGP.",
   "B": "Enable transit gateway appliance mode on the VPC attachment in VPC A and VPC B.",
   "C": "Enable transit gateway appliance mode on the VPC attachment in the shared VPC.",
   "D": "In the shared VPC, configure one VPC peering connection to VPC A and another VPC peering connection to VPC B."
  },
  "answer": [
   "C"
  ],
  "explanation": "By default a transit gateway keeps traffic in the same Availability Zone as the source attachment ENI, so for a VPC hosting a stateful firewall the return path can enter the inspection VPC in a different AZ than the forward path, causing the appliance to drop the asymmetric flow. Appliance mode makes the transit gateway select a single AZ/appliance for the lifetime of a flow using flow-hash affinity, ensuring both directions traverse the same firewall instance. Appliance mode must be enabled on the attachment of the VPC that contains the appliance — the shared inspection VPC — which is why C is correct and B is not. A replaces a high-bandwidth VPC attachment with VPN tunnels and does not address flow symmetry, and D with VPC peering bypasses the firewall entirely, violating the inspection requirement."
 },
 {
  "id": "dt-45",
  "source": "ditectrev",
  "domain": 3,
  "topic": "VPC Reachability Analyzer",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has deployed a critical application on a fleet of Amazon EC2 instances behind an Application Load Balancer. The application must always be reachable on port 443 from the public internet. The application recently had an outage that resulted from an incorrect change to the EC2 security group. A network engineer needs to automate a way to verify the network connectivity between the public internet and the EC2 instances whenever a change is made to the security group. The solution also must notify the network engineer when the change affects the connection. Which solution will meet these requirements?",
  "choices": {
   "A": "Enable VPC Flow Logs on the elastic network interface of each EC2 instance to capture REJECT traffic on port 443. Publish the flow log records to a log group in Amazon CloudWatch Logs. Create a CloudWatch Logs metric filter for the log group for rejected traffic. Create an alarm to notify the network engineer.",
   "B": "Enable VPC Flow Logs on the elastic network interface of each EC2 instance to capture all traffic on port 443. Publish the flow log records to a log group in Amazon CloudWatch Logs. Create a CloudWatch Logs metric filter for the log group for all traffic. Create an alarm to notify the network engineer",
   "C": "Create a VPC Reachability Analyzer path on port 443. Specify the security group as the source. Specify the EC2 instances as the destination. Create an Amazon Simple Notification Service (Amazon SNS) topic to notify the network engineer when a change to the security group affects the connection. Create an AWS Lambda function to start Reachability Analyzer and to publish a message to the SNS topic in case the analyses fail Create an Amazon EventBridge (Amazon CloudWatch Events) rule to invoke the Lambda function when a change to the security group occurs.",
   "D": "Create a VPC Reachability Analyzer path on port 443. Specify the internet gateway of the VPC as the source. Specify the EC2 instances as the destination. Create an Amazon Simple Notification Service (Amazon SNS) topic to notify the network engineer when a change to the security group affects the connection. Create an AWS Lambda function to start Reachability Analyzer and to publish a message to the SNS topic in case the analyses fail. Create an Amazon EventBridge (Amazon CloudWatch Events) rule to invoke the Lambda function when a change to the security group occurs."
  },
  "answer": [
   "D"
  ],
  "explanation": "VPC Reachability Analyzer performs static configuration analysis of security groups, NACLs, route tables and gateways between a source and destination resource, and it explicitly supports an internet gateway as the source when validating inbound reachability from the internet - that is what proves port 443 is still open to the instances after a change. A security group is not a valid Reachability Analyzer endpoint, so C cannot be built as written. Wiring an EventBridge rule to the CloudTrail security-group modification events (AuthorizeSecurityGroupIngress, RevokeSecurityGroupIngress, etc.) to invoke a Lambda function that calls StartNetworkInsightsAnalysis and publishes to SNS on failure gives the required automatic verification and notification. The VPC Flow Logs options fail the requirement because flow logs only record traffic that someone actually attempted; if no client tries to connect there is nothing to alert on, so a broken security group could go undetected, and flow logs are not triggered by configuration changes."
 },
 {
  "id": "dt-46",
  "source": "ditectrev",
  "domain": 3,
  "topic": "VPC Flow Logs",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team is performing an audit of a company's AWS deployment. The security team is concerned that two applications might be accessing resources that should be blocked by network ACLs and security groups. The applications are deployed across two Amazon Elastic Kubernetes Service (Amazon EKS) clusters that use the Amazon VPC Container Network Interface (CNI) plugin for Kubernetes. The clusters are in separate subnets within the same VPC and have a Cluster Autoscaler configured. The security team needs to determine which POD IP addresses are communicating with which services throughout the VPC. The security team wants to limit the number of flow logs and wants to examine the traffic from only the two applications. Which solution will meet these requirements with the LEAST operational overhead?",
  "choices": {
   "A": "Create VPC flow logs in the default format. Create a filter to gather flow logs only from the EKS nodes. Include the srcaddr field and the dstaddr field in the flow logs.",
   "B": "Create VPC flow logs in a custom format. Set the EKS nodes as the resource Include the pkt-srcaddr field and the pkt-dstaddr field in the flow logs.",
   "C": "Create VPC flow logs in a custom format. Set the application subnets as resources. Include the pkt-srcaddr field and the pkt-dstaddr field in the flow logs.",
   "D": "Create VPC flow logs in a custom format. Create a filter to gather flow logs only from the EKS nodes. Include the pkt-srcaddr field and the pkt-dstaddr field in the flow logs."
  },
  "answer": [
   "C"
  ],
  "explanation": "VPC Flow Logs can be created at the VPC, subnet, or ENI level, and choosing the two application subnets as the flow log resources naturally scopes collection to just those two applications while automatically covering any new nodes the Cluster Autoscaler launches into those subnets - no per-ENI reconfiguration, which is the least operational overhead. A custom format including pkt-srcaddr and pkt-dstaddr is required because with the Amazon VPC CNI plugin and SNAT/overlay behavior, the standard srcaddr/dstaddr fields can show the ENI or node address, whereas the pkt- fields record the true packet-level source and destination, revealing the actual Pod IP addresses. Options A and D fail because VPC Flow Logs has no concept of a 'filter' that selects which resources to log - scope is defined by the resource you attach the flow log to. Option B (setting the EKS nodes/ENIs as resources) captures the right fields but requires creating and deleting a flow log every time the Cluster Autoscaler changes the node count, which is high operational overhead and will miss traffic."
 },
 {
  "id": "dt-47",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Route 53 Resolver scaling",
  "difficulty": "medium",
  "multi": false,
  "question": "A data analytics company has a 100-node high performance computing (HPC) cluster. The HPC cluster is for parallel data processing and is hosted in a VPC in the AWS Cloud. As part of the data processing workflow, the HPC cluster needs to perform several DNS queries to resolve and connect to Amazon RDS databases, Amazon S3 buckets, and on-premises data stores that are accessible through AWS Direct Connect. The HPC cluster can increase in size by five to seven times during the company's peak event at the end of the year. The company is using two Amazon EC2 instances as primary DNS servers for the VPC. The EC2 instances are configured to forward queries to the default VPC resolver for Amazon Route 53 hosted domains and to the on-premises DNS servers for other on-premises hosted domain names. The company notices job failures and finds that DNS queries from the HPC cluster nodes failed when the nodes tried to resolve RDS and S3 bucket endpoints. Which architectural change should a network engineer implement to provide the DNS service in the MOST scalable way?",
  "choices": {
   "A": "Scale out the DNS service by adding two additional EC2 instances in the VPC. Reconfigure half of the HPC cluster nodes to use these new DNS servers. Plan to scale out by adding additional EC2 instance-based DNS servers in the future as the HPC cluster size grows.",
   "B": "Scale up the existing EC2 instances that the company is using as DNS servers. Change the instance size to the largest possible instance size to accommodate the current DNS load and the anticipated load in the future.",
   "C": "Create Route 53 Resolver outbound endpoints. Create Route 53 Resolver rules to forward queries to on-premises DNS servers for on premises hosted domain names. Reconfigure the HPC cluster nodes to use the default VPC resolver instead of the EC2 instance-based DNS servers. Terminate the EC2 instances.",
   "D": "Create Route 53 Resolver inbound endpoints. Create rules on the on-premises DNS servers to forward queries to the default VPC resolver. Reconfigure the HPC cluster nodes to forward all DNS queries to the on-premises DNS servers. Terminate the EC2 instances."
  },
  "answer": [
   "C"
  ],
  "explanation": "The failures are caused by the EC2-based forwarders being a bottleneck, and per-ENI Route 53 Resolver limits (roughly 1,024 packets per second per ENI) that self-managed forwarders funnel all queries through. Pointing the cluster nodes at the default VPC resolver (the .2 address) removes the single choke point because each instance's own ENI then gets its own query allowance, and AWS-managed Resolver scales automatically as the cluster grows five to seven times. Outbound Resolver endpoints plus forwarding rules handle only the on-premises domains, and those endpoints should be provisioned with multiple IP addresses across AZs to scale that path. Scaling out (A) or scaling up (B) EC2 DNS servers keeps the architecture self-managed and does not remove the per-ENI packet limit on the forwarders. D is backwards: sending all queries, including RDS and S3 lookups, out to on-premises servers and back through an inbound endpoint adds latency and creates a worse bottleneck over Direct Connect."
 },
 {
  "id": "dt-48",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect BGP communities",
  "difficulty": "medium",
  "multi": false,
  "question": "A company's network engineer is designing an active-passive connection to AWS from two on-premises data centers. The company has set up AWS Direct Connect connections between the on-premises data centers and AWS. From each location, the company is using a transit VIF that connects to a Direct Connect gateway that is associated with a transit gateway. The network engineer must ensure that traffic from AWS to the data centers is routed first to the primary data center. The traffic should be routed to the failover data center only in the case of an outage. Which solution will meet these requirements?",
  "choices": {
   "A": "Set the BGP community tag for all prefixes from the primary data center to 7224:7100. Set the BGP community tag for all prefixes from the failover data center to 7224:7300.",
   "B": "Set the BGP community tag for all prefixes from the primary data center to 7224:7300. Set the BGP community tag for all prefixes from the failover data center to 7224:7100.",
   "C": "Set the BGP community tag for all prefixes from the primary data center to 7224:9300. Set the BGP community tag for all prefixes from the failover data center to 7224:9100.",
   "D": "Set the BGP community tag for all prefixes from the primary data center to 7224:9100. Set the BGP community tag for all prefixes from the failover data center to 7224:9300."
  },
  "answer": [
   "B"
  ],
  "explanation": "Direct Connect supports local preference BGP community tags that the customer applies to prefixes advertised toward AWS to influence which path AWS uses for return traffic: 7224:7100 is low preference, 7224:7200 is medium, and 7224:7300 is high. To make AWS send traffic to the primary data center first and only use the secondary during an outage, the primary site's prefixes must carry the high tag 7224:7300 and the failover site's prefixes the low tag 7224:7100 (B). A simply reverses the two values and would pin traffic to the failover site. C and D use 7224:9100 and 7224:9300, which are the public VIF advertisement scope communities (local Region, continent, global) - they control how far AWS propagates your prefixes on a public VIF and have no effect on path preference for transit or private VIFs."
 },
 {
  "id": "dt-49",
  "source": "ditectrev",
  "domain": 1,
  "topic": "VPC Endpoints (Gateway vs Interface)",
  "difficulty": "easy",
  "multi": false,
  "question": "A real estate company is building an internal application so that real estate agents can upload photos and videos of various properties. The application will store these photos and videos in an Amazon S3 bucket as objects and will use Amazon DynamoDB to store corresponding metadata. The S3 bucket will be configured to publish all PUT events for new object uploads to an Amazon Simple Queue Service (Amazon SQS) queue. A compute cluster of Amazon EC2 instances will poll the SQS queue to find out about newly uploaded objects. The cluster will retrieve new objects, perform proprietary image and video recognition and classification update metadata in DynamoDB and replace the objects with new watermarked objects. The company does not want public IP addresses on the EC2 instances. Which networking design solution will meet these requirements MOST cost-effectively as application usage increases?",
  "choices": {
   "A": "Place the EC2 instances in a public subnet. Disable the Auto-assign Public IP option while launching the EC2 instances. Create an internet gateway. Attach the internet gateway to the VPC. In the public subnet's route table, add a default route that points to the internet gateway.",
   "B": "Place the EC2 instances in a private subnet. Create a NAT gateway in a public subnet in the same Availability Zone. Create an internet gateway. Attach the internet gateway to the VPC. In the public subnet's route table, add a default route that points to the internet gateway.",
   "C": "Place the EC2 instances in a private subnet. Create an interface VPC endpoint for Amazon SQS. Create gateway VPC endpoints for Amazon S3 and DynamoDB.",
   "D": "Place the EC2 instances in a private subnet. Create a gateway VPC endpoint for Amazon SQS. Create interface VPC endpoints for Amazon S3 and DynamoDB."
  },
  "answer": [
   "C"
  ],
  "explanation": "Gateway VPC endpoints exist only for Amazon S3 and DynamoDB, and they are free of charge with no hourly or data processing fees, making them the most cost-effective way to reach those two services privately as usage grows. Amazon SQS has no gateway endpoint, so an interface endpoint (PrivateLink) is required for it. C matches this service support exactly, and no public IPs or NAT are involved. D inverts the endpoint types and is simply not supported. B works functionally but incurs NAT gateway hourly plus per-GB processing charges on all S3, DynamoDB, and SQS traffic, which grows expensive as image and video volume increases. A places instances in a public subnet with a default route to an internet gateway, which cannot provide internet access without public IPs and also exposes the subnet unnecessarily."
 },
 {
  "id": "dt-50",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect SiteLink / TGW peering",
  "difficulty": "hard",
  "multi": false,
  "question": "A company has an AWS Direct Connect connection between its on-premises data center in the United States (US) and workloads in the us-east-1 Region. The connection uses a transit VIF to connect the data center to a transit gateway in us-east-1. The company is opening a new office in Europe with a new on-premises data center in England. A Direct Connect connection will connect the new data center with some workloads that are running in a single VPC in the eu-west-2 Region. The company needs to connect the US data center and us-east-1 with the Europe data center and eu-west-2. A network engineer must establish full connectivity between the data centers and Regions with the lowest possible latency. How should the network engineer design the network architecture to meet these requirements?",
  "choices": {
   "A": "Connect the VPC in eu-west-2 with the Europe data center by using a Direct Connect gateway and a private VIF. Associate the transit gateway in us-east-1 with the same Direct Connect gateway. Enable SiteLink for the transit VIF and the private VIF.",
   "B": "Connect the VPC in eu-west-2 to a new transit gateway. Connect the Europe data center to the new transit gateway by using a Direct Connect gateway and a new transit VIF. Associate the transit gateway in us-east-1 with the same Direct Connect gateway. Enable SiteLink for both transit VIFs. Peer the two transit gateways.",
   "C": "Connect the VPC in eu-west-2 to a new transit gateway. Connect the Europe data center to the new transit gateway by using a Direct Connect gateway and a new transit VIF. Create a new Direct Connect gateway. Associate the transit gateway in us-east-1 with the new Direct Connect gateway. Enable SiteLink for both transit VIFs. Peer the two transit gateways.",
   "D": "Connect the VPC in eu-west-2 with the Europe data center by using a Direct Connect gateway and a private VIF. Create a new Direct Connect gateway. Associate the transit gateway in us-east-1 with the new Direct Connect gateway. Enable SiteLink for the transit VIF and the private VIF."
  },
  "answer": [
   "B"
  ],
  "explanation": "Full connectivity here needs three things: each data center to its local Region, Region to Region, and data center to data center. Putting the eu-west-2 VPC behind a new transit gateway and using a transit VIF to the same Direct Connect gateway that already carries the US transit VIF keeps both TGW associations on one DXGW (a Direct Connect gateway supports multiple transit VIFs and multiple transit gateway associations). Because transit gateways associated with the same DXGW cannot route to each other transitively, an explicit inter-Region transit gateway peering attachment is required, and that peering rides the AWS global backbone for the lowest Region-to-Region latency. SiteLink on both transit VIFs provides direct data-center-to-data-center traffic over the Direct Connect network without hairpinning through a Region. C fails because moving the us-east-1 transit gateway association to a brand-new Direct Connect gateway that has no VIF would break the existing US connectivity. A and D use a private VIF to the eu-west-2 VPC, which attaches to a virtual private gateway and therefore cannot participate in transit gateway peering, leaving no Region-to-Region path."
 },
 {
  "id": "dt-51",
  "source": "ditectrev",
  "domain": 3,
  "topic": "VPC endpoints / connectivity troubleshooting",
  "difficulty": "medium",
  "multi": true,
  "question": "A network engineer has deployed an Amazon EC2 instance in a private subnet in a VPC. The VPC has no public subnet. The EC2 instance hosts application code that sends messages to an Amazon Simple Queue Service (Amazon SQS) queue. The subnet has the default network ACL with no modification applied. The EC2 instance has the default security group with no modification applied. The SQS queue is not receiving messages. Which of the following are possible causes of this problem? (Choose two.)",
  "choices": {
   "A": "The EC2 instance is not attached to an IAM role that allows write operations to Amazon SQS.",
   "B": "The security group is blocking traffic to the IP address range used by Amazon SQS.",
   "C": "There is no interface VPC endpoint configured for Amazon SQS.",
   "D": "The network ACL is blocking return traffic from Amazon SQS.",
   "E": "There is no route configured in the subnet route table for the IP address range used by Amazon SQS."
  },
  "answer": [
   "A",
   "C"
  ],
  "explanation": "Amazon SQS is an API-driven service reached over HTTPS, so two things must be true: the instance must have IAM credentials permitting sqs:SendMessage (A), and, because the VPC has no internet gateway or NAT path, it needs an interface VPC endpoint (AWS PrivateLink) for com.amazonaws.region.sqs to reach the API privately (C). Option B is wrong because the default security group allows all outbound traffic, so nothing is being blocked on egress. Option D is wrong because the default network ACL allows all inbound and outbound traffic in both directions, so return traffic is not being dropped. Option E is a distractor: reaching a public AWS service endpoint from a private subnet is not solved by adding a route for SQS IP ranges - there is no gateway to route to, and SQS has no gateway endpoint - so the interface endpoint in C is the actual mechanism."
 },
 {
  "id": "dt-52",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Centralized PrivateLink interface endpoints",
  "difficulty": "hard",
  "multi": false,
  "question": "A network engineer needs to standardize a company's approach to centralizing and managing interface VPC endpoints for private communication with AWS services. The company uses AWS Transit Gateway for inter-VPC connectivity between AWS accounts through a hub-and-spoke model. The company's network services team must manage all Amazon Route 53 zones and interface endpoints within a shared services AWS account. The company wants to use this centralized model to provide AWS resources with access to AWS Key Management Service (AWS KMS) without sending traffic over the public internet. What should the network engineer do to meet these requirements?",
  "choices": {
   "A": "In the shared services account, create an interface endpoint for AWS KMS. Modify the interface endpoint by disabling the private DNS name. Create a private hosted zone in the shared services account with an alias record that points to the interface endpoint. Associate the private hosted zone with the spoke VPCs in each AWS account.",
   "B": "In the shared services account, create an interface endpoint for AWS KMS. Modify the interface endpoint by disabling the private DNS name. Create a private hosted zone in each spoke AWS account with an alias record that points to the interface endpoint. Associate each private hosted zone with the shared services AWS account.",
   "C": "In each spoke AWS account, create an interface endpoint for AWS KMS. Modify each interface endpoint by disabling the private DNS name. Create a private hosted zone in each spoke AWS account with an alias record that points to each interface endpoint. Associate each private hosted zone with the shared services AWS account.",
   "D": "In each spoke AWS account, create an interface endpoint for AWS KMS. Modify each interface endpoint by disabling the private DNS name. Create a private hosted zone in the shared services account with an alias record that points to each interface endpoint. Associate the private hosted zone with the spoke VPCs in each AWS account."
  },
  "answer": [
   "A"
  ],
  "explanation": "Centralized interface endpoints require the endpoint to live once in the shared services account, with private DNS disabled so that the endpoint does not hijack kms.<region>.amazonaws.com only inside the shared services VPC. The network services team then creates a private hosted zone for kms.<region>.amazonaws.com in the shared services account containing an alias record to the interface endpoint, and associates that one hosted zone with each spoke VPC (cross-account association is supported via CreateVPCAssociationAuthorization). Spoke VPC traffic then resolves to the endpoint's private IPs and reaches them over the existing Transit Gateway hub-and-spoke attachments. B and C fail the governance requirement because the hosted zones would be owned and managed in the spoke accounts rather than centrally, and 'associating a private hosted zone with an account' is not how association works, it is with a VPC. C and D also defeat the purpose by creating an endpoint in every spoke account, multiplying hourly and data processing charges."
 },
 {
  "id": "dt-53",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Route 53 subdomain delegation",
  "difficulty": "easy",
  "multi": true,
  "question": "A development team is building a new web application in the AWS Cloud. The main company domain, example.com, is currently hosted in an Amazon Route 53 public hosted zone in one of the company's production AWS accounts. The developers want to test the web application in the company's staging AWS account by using publicly resolvable subdomains under the example.com domain with the ability to create and delete DNS records as needed. Developers have full access to Route 53 hosted zones within the staging account, but they are prohibited from accessing resources in any of the production AWS accounts. Which combination of steps should a network engineer take to allow the developers to create records under the example com domain? (Choose two.)",
  "choices": {
   "A": "Create a public hosted zone for example com in the staging account.",
   "B": "Create a staging example.com NS record in the example.com domain. Populate the value with the name servers from the staging.example.com domain. Set the routing policy type to simple routing.",
   "C": "Create a private hosted zone for staging example com in the staging account.",
   "D": "Create an example com NS record in the staging example.com domain. Populate the value with the name servers from the example.com domain. Set the routing policy type to simple routing.",
   "E": "Create a public hosted zone for staging.example.com in the staging account."
  },
  "answer": [
   "B",
   "E"
  ],
  "explanation": "The standard pattern for delegating a subdomain across AWS accounts is to create a public hosted zone for staging.example.com in the staging account (E), then add an NS record named staging.example.com in the parent example.com public hosted zone whose values are the four delegated name servers Route 53 assigned to the new staging zone, using simple routing (B). This makes staging.example.com publicly resolvable and gives developers full record-management rights in their own account without any access to the production account or its zone. A is wrong because two separate public hosted zones for the identical apex example.com would create competing authoritative zones with no delegation from the registrar. C fails the 'publicly resolvable' requirement - a private hosted zone only answers inside associated VPCs. D reverses the delegation direction, pointing the parent domain's name servers from inside the child zone, which accomplishes nothing."
 },
 {
  "id": "dt-54",
  "source": "ditectrev",
  "domain": 1,
  "topic": "S3 Gateway Endpoint / Data Transfer Cost",
  "difficulty": "easy",
  "multi": false,
  "question": "A company plans to deploy a two-tier web application to a new VPC in a single AWS Region. The company has configured the VPC with an internet gateway and four subnets. Two of the subnets are public and have default routes that point to the internet gateway. Two of the subnets are private and share a route table that does not have a default route. The application will run on a set of Amazon EC2 instances that will be deployed behind an external Application Load Balancer. The EC2 instances must not be directly accessible from the internet. The application will use an Amazon S3 bucket in the same Region to store data. The application will invoke S3 GET API operations and S3 PUT API operations from the EC2 instances. A network engineer must design a VPC architecture that minimizes data transfer cost. Which solution will meet these requirements?",
  "choices": {
   "A": "Deploy the EC2 instances in the public subnets. Create an S3 interface endpoint in the VPC. Modify the application configuration to use the S3 endpoint-specific DNS hostname.",
   "B": "Deploy the EC2 instances in the private subnets. Create a NAT gateway in the VPC. Create default routes in the private subnets to the NAT gateway. Connect to Amazon S3 by using the NAT gateway.",
   "C": "Deploy the EC2 instances in the private subnets. Create an S3 gateway endpoint in the VPC. Specify the route table of the private subnets during endpoint creation to create routes to Amazon S3.",
   "D": "Deploy the EC2 instances in the private subnets. Create an S3 interface endpoint in the VPC. Modify the application configuration to use the S3 endpoint-specific DNS hostname."
  },
  "answer": [
   "C"
  ],
  "explanation": "An S3 gateway endpoint is added as a prefix-list route in the selected route tables and carries traffic to S3 in the same Region over the AWS network at no hourly or per-GB charge, which minimizes data transfer cost while keeping the instances private with no default route to the internet. C describes this correctly. B routes GET/PUT traffic through a NAT gateway, which bills both an hourly rate and per-GB data processing, the most expensive option. D uses an S3 interface endpoint, which also carries hourly ENI charges and per-GB processing fees — it is useful for on-premises access, but unnecessary and costlier for in-VPC, in-Region S3 access. A additionally violates the requirement that the EC2 instances not be directly reachable from the internet."
 },
 {
  "id": "dt-55",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Transit Gateway sharing with AWS RAM",
  "difficulty": "easy",
  "multi": false,
  "question": "A company has two AWS accounts one for Production and one for Connectivity. A network engineer needs to connect the Production account VPC to a transit gateway in the Connectivity account. The feature to auto accept shared attachments is not enabled on the transit gateway. Which set of steps should the network engineer follow in each AWS account to meet these requirements?",
  "choices": {
   "A": "1. In the Production account: Create a resource share in AWS Resource Access Manager for the transit gateway. Provide the Connectivity account ID. Enable the feature to allow external accounts. 2. In the Connectivity account: Accept the resource. 3. In the Connectivity account: Create an attachment to the VPC subnets. 4. In the Production account: Accept the attachment. Associate a route table with the attachment.",
   "B": "1. In the Production account: Create a resource share in AWS Resource Access Manager for the VPC subnets. Provide the Connectivity account ID. Enable the feature to allow external accounts. 2. In the Connectivity account: Accept the resource. 3. In the Production account: Create an attachment on the transit gateway to the VPC subnets. 4. In the Connectivity account: Accept the attachment. Associate a route table with the attachment.",
   "C": "1. In the Connectivity account: Create a resource share in AWS Resource Access Manager for the VPC subnets. Provide the Production account ID. Enable the feature to allow external accounts. 2. In the Production account: Accept the resource. 3. In the Connectivity account: Create an attachment on the transit gateway to the VPC subnets. 4. In the Production account: Accept the attachment. Associate a route table with the attachment.",
   "D": "1. In the Connectivity account: Create a resource share in AWS Resource Access Manager for the transit gateway. Provide the Production account ID Enable the feature to allow external accounts. 2. In the Production account: Accept the resource. 3. In the Production account: Create an attachment to the VPC subnets. 4. In the Connectivity account: Accept the attachment. Associate a route table with the attachment."
  },
  "answer": [
   "D"
  ],
  "explanation": "The transit gateway lives in the Connectivity account, so the Connectivity account is the resource owner and must create the AWS RAM resource share for the transit gateway and grant it to the Production account (enabling sharing with external accounts if the two accounts are not in the same AWS Organization). After the Production account accepts the share, the VPC owner - the Production account - creates the transit gateway VPC attachment, because an attachment must be created by the account that owns the subnets and ENIs. Since auto-accept shared attachments is disabled, the transit gateway owner (Connectivity) must then accept the attachment, and only the transit gateway owner can associate it with a transit gateway route table and enable propagation. A and B invert the ownership by sharing the transit gateway or subnets from the wrong account; C additionally has the Connectivity account creating an attachment to subnets it does not own."
 },
 {
  "id": "dt-56",
  "source": "ditectrev",
  "domain": 4,
  "topic": "GuardDuty / threat detection",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is running multiple workloads on Amazon EC2 instances in public subnets. In a recent incident, an attacker exploited an application vulnerability on one of the EC2 instances to gain access to the instance. The company fixed the application and launched a replacement EC2 instance that contains the updated application. The attacker used the compromised application to spread malware over the internet. The company became aware of the compromise through a notification from AWS. The company needs the ability to identify when an application that is deployed on an EC2 instance is spreading malware. Which solution will meet this requirement with the LEAST operational effort?",
  "choices": {
   "A": "Use Amazon GuardDuty to analyze traffic patterns by inspecting DNS requests and VPC flow logs.",
   "B": "Use Amazon GuardDuty to deploy AWS managed decoy systems that are equipped with the most recent malware signatures.",
   "C": "Set up a Gateway Load Balancer. Run an intrusion detection system (IDS) appliance from AWS Marketplace on Amazon EC2 for traffic inspection.",
   "D": "Configure Amazon Inspector to perform deep packet inspection of outgoing traffic."
  },
  "answer": [
   "A"
  ],
  "explanation": "Amazon GuardDuty is a managed threat detection service that continuously ingests VPC Flow Logs, DNS query logs, and CloudTrail events and applies AWS threat intelligence and machine learning, producing findings such as Backdoor:EC2/C&CActivity, Trojan:EC2/DropPoint, and Impact:EC2/MaliciousDomainRequest that identify an instance communicating with malware infrastructure or spreading malware. Enabling it is a single click per account/Region with no agents, no traffic-path changes, and no appliances, which is the least operational effort. Option B is fabricated - GuardDuty does not deploy decoy/honeypot systems. Option C requires deploying, licensing, patching, and scaling a third-party IDS fleet behind a Gateway Load Balancer plus routing changes, which is far more operational effort. Option D is wrong because Amazon Inspector performs software vulnerability and network reachability assessments, not packet inspection of traffic."
 },
 {
  "id": "dt-57",
  "source": "ditectrev",
  "domain": 3,
  "topic": "ALB stickiness troubleshooting",
  "difficulty": "medium",
  "multi": false,
  "question": "A company deploys a new web application on Amazon EC2 instances. The application runs in private subnets in three Availability Zones behind an Application Load Balancer (ALB). Security auditors require encryption of all connections. The company uses Amazon Route 53 for DNS and uses AWS Certificate Manager (ACM) to automate SSL/TLS certificate provisioning. SSL/TLS connections are terminated on the ALB. The company tests the application with a single EC2 instance and does not observe any problems. However, after production deployment, users report that they can log in but that they cannot use the application. Every new web request restarts the login process. What should a network engineer do to resolve this issue?",
  "choices": {
   "A": "Modify the ALB listener configuration. Edit the rule that forwards traffic to the target group. Change the rule to enable group-level stickiness. Set the duration to the maximum application session length.",
   "B": "Replace the ALB with a Network Load Balancer. Create a TLS listener. Create a new target group with the protocol type set to TLS Register the EC2 instances. Modify the target group configuration by enabling the stickiness attribute.",
   "C": "Modify the ALB target group configuration by enabling the stickiness attribute. Use an application-based cookie. Set the duration to the maximum application session length.",
   "D": "Remove the ALB. Create an Amazon Route 53 rule with a failover routing policy for the application name. Configure ACM to issue certificates for each EC2 instance."
  },
  "answer": [
   "C"
  ],
  "explanation": "The symptom, a login that succeeds but a session that restarts on each request, is classic session affinity loss: with one instance every request landed on the same host, but with three AZs of targets the round-robin algorithm spreads requests across instances that do not share session state. Enabling stickiness on the ALB target group with an application-based cookie makes the ALB honor the application's own session cookie and pin the client to the same target for the configured duration, up to seven days. A is wrong because target group-level stickiness on a listener rule applies to weighted forwarding across multiple target groups, keeping a client on one target group rather than one target, which does not fix intra-group distribution. B discards Layer 7 capabilities and NLB flow stickiness is source-IP based, which breaks behind NAT and proxies. D removes load balancing entirely and misuses failover routing, which sends all traffic to a single primary instance."
 },
 {
  "id": "dt-58",
  "source": "ditectrev",
  "domain": 3,
  "topic": "NAT Gateway timeouts",
  "difficulty": "easy",
  "multi": false,
  "question": "A company recently migrated its Amazon EC2 instances to VPC private subnets to satisfy a security compliance requirement. The EC2 instances now use a NAT gateway for internet access. After the migration, some long-running database queries from private EC2 instances to a publicly accessible third-party database no longer receive responses. The database query logs reveal that the queries successfully completed after 7 minutes but that the client EC2 instances never received the response. Which configuration change should a network engineer implement to resolve this issue?",
  "choices": {
   "A": "Configure the NAT gateway timeout to allow connections for up to 600 seconds.",
   "B": "Enable enhanced networking on the client EC2 instances.",
   "C": "Enable TCP keepalive on the client EC2 instances with a value of less than 300 seconds.",
   "D": "Close idle TCP connections through the NAT gateway."
  },
  "answer": [
   "C"
  ],
  "explanation": "A NAT gateway drops any connection that has been idle for more than 350 seconds and then responds to subsequent packets with a TCP RST. A query that takes about 7 minutes (420 seconds) to produce a result therefore has its NAT translation entry expired before the database replies, so the response never reaches the client. Enabling TCP keepalives on the client instances with an interval below 350 seconds (C) keeps packets flowing on the connection so the NAT gateway entry stays alive - this is the fix AWS explicitly documents for this scenario. A is impossible: the NAT gateway idle timeout is a fixed AWS-managed value that customers cannot configure. B addresses packet-per-second and throughput performance, not idle-connection expiry. D would actively make the problem worse by tearing connections down sooner."
 },
 {
  "id": "dt-59",
  "source": "ditectrev",
  "domain": 4,
  "topic": "Route 53 Resolver Query Logging",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is using Amazon Route 53 Resolver for its hybrid DNS infrastructure. The company is using Route 53 Resolver forwarding rules for authoritative domains that are hosted on on-premises DNS servers. The company achieves hybrid network connectivity by using an AWS Site-to-Site VPN connection. A new governance policy requires logging for DNS traffic that originates in the AWS Cloud. The policy also requires the company to query DNS traffic to identify the source IP address of the resources that the query originated from, along with the DNS name that was requested. Which solution will meet these requirements?",
  "choices": {
   "A": "Create VPC flow logs for all VPCs. Send the logs to Amazon CloudWatch Logs. Use CloudWatch Logs Insights to query the IP address and DNS name.",
   "B": "Configure Route 53 Resolver query logging for all VPCs. Send the logs to Amazon CloudWatch Logs. Use CloudWatch Logs Insights to query the IP address and DNS name.",
   "C": "Configure DNS logging for the Site-to-Site VPN connection. Send the logs to an Amazon S3 bucket. Use Amazon Athena to query the IP address and DNS name.",
   "D": "Modify the existing Route 53 Resolver rules to configure logging. Send the logs to an Amazon S3 bucket. Use Amazon Athena to query the IP address and DNS name."
  },
  "answer": [
   "B"
  ],
  "explanation": "Route 53 Resolver query logging records DNS queries originating from resources in a VPC, and each log record includes the source IP address (and instance ID/ENI) of the querying resource, the query name, type, response code, and answers — exactly the two required fields. Logs can be delivered to CloudWatch Logs, S3, or Kinesis Data Firehose; sending them to CloudWatch Logs lets the team run CloudWatch Logs Insights queries directly, so B meets the requirement. A is insufficient because VPC flow logs record 5-tuple IP/port metadata only and never contain the queried DNS name. C is fictitious — Site-to-Site VPN has no DNS logging feature. D is also fictitious: logging is configured through a Resolver query logging configuration associated with VPCs, not as an option on Resolver forwarding rules."
 },
 {
  "id": "dt-60",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect gateway / Transit VIF",
  "difficulty": "easy",
  "multi": false,
  "question": "A company uses AWS Direct Connect to connect its corporate network to multiple VPCs in the same AWS account and the same AWS Region. Each VPC uses its own private VIF and its own virtual LAN on the Direct Connect connection. The company has grown and will soon surpass the limit of VPCs and private VIFs for each connection. What is the MOST scalable way to add VPCs with on-premises connectivity?",
  "choices": {
   "A": "Provision a new Direct Connect connection to handle the additional VPCs. Use the new connection to connect additional VPCs.",
   "B": "Create virtual private gateways for each VPC that is over the service quota. Use AWS Site-to-Site VPN to connect the virtual private gateways to the corporate network.",
   "C": "Create a Direct Connect gateway, and add virtual private gateway associations to the VPCs. Configure a private VIF to connect to the corporate network.",
   "D": "Create a transit gateway, and attach the VPCs. Create a Direct Connect gateway, and associate it with the transit gateway. Create a transit VIF to the Direct Connect gateway."
  },
  "answer": [
   "D"
  ],
  "explanation": "Private VIFs are the scaling bottleneck: each dedicated connection supports 50 virtual interfaces and each private VIF maps to one virtual private gateway or Direct Connect gateway, so the one-VIF-per-VPC pattern does not scale. Attaching all VPCs to a transit gateway and associating that transit gateway with a Direct Connect gateway lets a single transit VIF carry connectivity for every attached VPC (thousands of VPC attachments per transit gateway), which is by far the most scalable design. C is better than the status quo but still uses a Direct Connect gateway with virtual private gateway associations, which is capped at 20 VGW associations per DXGW and gives no VPC-to-VPC connectivity. A just buys another circuit and repeats the same VIF-per-VPC anti-pattern. B replaces private connectivity with internet-based VPN, which changes the performance and security profile and still needs one VGW per VPC."
 },
 {
  "id": "dt-61",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect gateways and VIFs",
  "difficulty": "hard",
  "multi": false,
  "question": "A network engineer is designing a hybrid architecture that uses a 1 Gbps AWS Direct Connect connection between the company's data center and two AWS Regions: us-east-1 and eu-west-1. The VPCs in us-east-1 are connected by a transit gateway and need to access several on-premises databases. According to company policy, only one VPC in eu-west-1 can be connected to one on-premises server. The on-premises network segments the traffic between the databases and the server. How should the network engineer set up the Direct Connect connection to meet these requirements?",
  "choices": {
   "A": "Create one hosted connection. Use a transit VIF to connect to the transit gateway in us-east-1. Use a private VIF to connect to the VPC in eu-west-1. Use one Direct. Connect gateway for both VIFs to route from the Direct Connect locations to the corresponding AWS Region along the path that has the lowest latency.",
   "B": "Create one hosted connection. Use a transit VIF to connect to the transit gateway in us-east-1. Use a private VIF to connect to the VPC in eu-west-1. Use two Direct Connect gateways, one for each VIF, to route from the Direct Connect locations to the corresponding AWS Region along the path that has the lowest latency.",
   "C": "Create one dedicated connection. Use a transit VIF to connect to the transit gateway in us-east-1. Use a private VIF to connect to the VPC in eu-west-1. Use one Direct Connect gateway for both VIFs to route from the Direct Connect locations to the corresponding AWS Region along the path that has the lowest latency.",
   "D": "Create one dedicated connection. Use a transit VIF to connect to the transit gateway in us-east-1. Use a private VIF to connect to the VPC in eu-west-1. Use two Direct Connect gateways, one for each VIF, to route from the Direct Connect locations to the corresponding AWS Region along the path that has the lowest latency."
  },
  "answer": [
   "D"
  ],
  "explanation": "A hosted connection supports only a single virtual interface, so it cannot carry both the transit VIF to us-east-1 and the private VIF to eu-west-1 - a dedicated connection is required, which eliminates A and B. Two separate Direct Connect gateways are needed because a single Direct Connect gateway cannot be associated with both a transit gateway and a virtual private gateway/VPC at the same time, and using one DXGW would also merge the routing domains and let the eu-west-1 VPC reach the on-premises databases, violating the segregation policy. With two DXGWs - one associated with the us-east-1 transit gateway and one with the eu-west-1 VGW - each VIF has an independent routing domain, and Direct Connect gateways provide the global (cross-Region) reach from the Direct Connect location to both Regions. Option C fails on the shared-DXGW routing/segregation problem even though it correctly uses a dedicated connection."
 },
 {
  "id": "dt-62",
  "source": "ditectrev",
  "domain": 3,
  "topic": "VPC Flow Logs",
  "difficulty": "easy",
  "multi": false,
  "question": "A company has deployed an application in a VPC that uses a NAT gateway for outbound traffic to the internet. A network engineer notices a large quantity of suspicious network traffic that is traveling from the VPC over the internet to IP addresses that are included on a deny list. The network engineer must implement a solution to determine which AWS resources are generating the suspicious traffic. The solution must minimize cost and administrative overhead. Which solution will meet these requirements?",
  "choices": {
   "A": "Launch an Amazon EC2 instance in the VPC. Use Traffic Mirroring by specifying the NAT gateway as the source and the EC2 instance as the destination. Analyze the captured traffic by using open-source tools to identify the AWS resources that are generating the suspicious traffic.",
   "B": "Use VPC flow logs. Launch a security information and event management (SIEM) solution in the VPC. Configure the SIEM solution to ingest the VPC flow logs. Run queries on the SIEM solution to identify the AWS resources that are generating the suspicious traffic.",
   "C": "Use VPC flow logs. Publish the flow logs to a log group in Amazon CloudWatch Logs. Use CloudWatch Logs Insights to query the flow logs to identify the AWS resources that are generating the suspicious traffic.",
   "D": "Configure the VPC to stream the network traffic directly to an Amazon Kinesis data stream. Send the data from the Kinesis data stream to an Amazon Kinesis Data Firehose delivery stream to store the data in Amazon S3. Use Amazon Athena to query the data to identify the AWS resources that are generating the suspicious traffic."
  },
  "answer": [
   "C"
  ],
  "explanation": "VPC Flow Logs record source and destination IP, ports, protocol, and bytes for each flow, and because flow log records are captured at the ENI level, the entries generated before source NAT still show the private IP of the originating instance, which is exactly what identifies the offending resource. Publishing to CloudWatch Logs and querying with CloudWatch Logs Insights requires no infrastructure to build or run, so cost and administrative overhead are minimal. Traffic Mirroring (A) cannot use a NAT gateway as a mirror source (sources must be ENIs on supported Nitro instances), and running capture appliances plus full packet analysis is far more expensive. Running a SIEM in the VPC (B) adds significant licensing and operational cost for the same data. D is not a real capability: a VPC cannot stream raw network traffic directly into Kinesis Data Streams, and building the Firehose/S3/Athena pipeline would add overhead even if it could."
 },
 {
  "id": "dt-63",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect gateway / Transit Gateway",
  "difficulty": "hard",
  "multi": true,
  "question": "A company has its production VPC (VPC-A) in the eu-west-1 Region in Account 1. VPC-A is attached to a transit gateway (TGW-A) that is connected to an on-premises data center in Dublin, Ireland, by an AWS Direct Connect transit VIF that is configured for an AWS Direct Connect gateway. The company also has a staging VPC (VPC-B) that is attached to another transit gateway (TGW-B) in the eu-west-2 Region in Account 2. A network engineer must implement connectivity between VPC-B and the on-premises data center in Dublin. Which solutions will meet these requirements? (Choose two.)",
  "choices": {
   "A": "Configure inter-Region VPC peering between VPC-A and VPC-B. Add the required VPC peering routes. Add the VPC-B CIDR block in the allowed prefixes on the Direct Connect gateway association.",
   "B": "Associate TGW-B with the Direct Connect gateway. Advertise the VPC-B CIDR block under the allowed prefixes.",
   "C": "Configure another transit VIF on the Direct Connect connection and associate TGW-B. Advertise the VPC-B CIDR block under the allowed prefixes.",
   "D": "Configure inter-Region transit gateway peering between TGW-A and TGW-B. Add the peering routes in the transit gateway route tables. Add both the VPC-A and the VPC-B CIDR block under the allowed prefix list in the Direct Connect gateway association.",
   "E": "Configure an AWS Site-to-Site VPN connection over the transit VIF to TGW-B as a VPN attachment."
  },
  "answer": [
   "B",
   "D"
  ],
  "explanation": "A Direct Connect gateway can be associated with up to six transit gateways, including transit gateways in other Regions and other AWS accounts, so TGW-B in eu-west-2 can simply be associated with the same Direct Connect gateway and VPC-B's CIDR added to that association's allowed prefixes (B). Alternatively, inter-Region transit gateway peering between TGW-A and TGW-B, with peering routes installed in both transit gateway route tables and both CIDRs listed in the allowed prefix list of the TGW-A association, carries on-premises traffic through TGW-A and across the peering to VPC-B (D). C is invalid because a Direct Connect connection supports only one transit VIF and a transit VIF can be associated with only one Direct Connect gateway. A fails because VPC peering does not support transitive routing - traffic arriving from the Direct Connect gateway into VPC-A cannot be forwarded over a peering connection to VPC-B. E is not possible: AWS Site-to-Site VPN must run over a public VIF (or the internet), not over a transit VIF."
 },
 {
  "id": "dt-64",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Hybrid DNS / Route 53 Resolver Endpoints",
  "difficulty": "medium",
  "multi": true,
  "question": "A company's network engineer is designing a hybrid DNS solution for an AWS Cloud workload. Individual teams want to manage their own DNS hostnames for their applications in their development environment. The solution must integrate the application-specific hostnames with the centrally managed DNS hostnames from the on-premises network and must provide bidirectional name resolution. The solution also must minimize management overhead. Which combination of steps should the network engineer take to meet these requirements? (Choose three.)",
  "choices": {
   "A": "Use an Amazon Route 53 Resolver inbound endpoint.",
   "B": "Modify the DHCP options set by setting a custom DNS server value.",
   "C": "Use an Amazon Route 53 Resolver outbound endpoint.",
   "D": "Create DNS proxy servers.",
   "E": "Create Amazon Route 53 private hosted zones.",
   "F": "Set up a zone transfer between Amazon Route 53 and the on-premises DNS."
  },
  "answer": [
   "A",
   "C",
   "E"
  ],
  "explanation": "Bidirectional hybrid DNS with minimal management overhead is the canonical Route 53 Resolver design. Private hosted zones (E) let each team create and manage their own application records in their own account, with the zone associated to the relevant VPCs. A Route 53 Resolver inbound endpoint (A) gives on-premises DNS servers a target to conditionally forward AWS-domain queries to, providing on-premises to AWS resolution. A Resolver outbound endpoint (C) with forwarding rules sends queries for the centrally managed on-premises domains from the VPCs to the on-premises DNS servers, completing the second direction. B (custom DNS servers in the DHCP options set) and D (self-managed DNS proxy servers) both break the automatic resolution of private hosted zones and add servers to operate. F is not viable because Route 53 does not support standard AXFR/IXFR zone transfers with external DNS servers."
 },
 {
  "id": "dt-65",
  "source": "ditectrev",
  "domain": 4,
  "topic": "Lambda@Edge / CloudFront",
  "difficulty": "medium",
  "multi": false,
  "question": "A company hosts a web application on Amazon EC2 instances behind an Application Load Balancer (ALB). The ALB is the origin in an Amazon CloudFront distribution. The company wants to implement a custom authentication system that will provide a token for its authenticated customers. The web application must ensure that the GET/POST requests come from authenticated customers before it delivers the content. A network engineer must design a solution that gives the web application the ability to identify authorized customers. What is the MOST operationally efficient solution that meets these requirements?",
  "choices": {
   "A": "Use the ALB to inspect the authorized token inside the GET/POST request payload. Use an AWS Lambda function to insert a customized header to inform the web application of an authenticated customer request.",
   "B": "Integrate AWS WAF with the ALB to inspect the authorized token inside the GET/POST request payload. Configure the ALB listener to insert a customized header to inform the web application of an authenticated customer request.",
   "C": "Use an AWS Lambda@Edge function to inspect the authorized token inside the GET/POST request payload. Use the Lambda@Edge function also to insert a customized header to inform the web application of an authenticated customer request.",
   "D": "Set up an EC2 instance that has a third-party packet inspection tool to inspect the authorized token inside the GET/POST request payload. Configure the tool to insert a customized header to inform the web application of an authenticated customer request."
  },
  "answer": [
   "C"
  ],
  "explanation": "Lambda@Edge runs on CloudFront and, in a viewer-request or origin-request trigger, can be configured with include-body to read the POST payload, evaluate the custom token, and mutate the request headers before CloudFront forwards it to the ALB origin - so one function both validates the token and injects the header the application expects, and the check happens at the edge before traffic reaches the origin. An ALB cannot inspect request bodies or conditionally insert arbitrary headers based on payload content, so A is not implementable as described (a Lambda function is not in the ALB request path here). B is close but wrong in mechanism: AWS WAF can inspect a portion of the body and allow or block, yet it cannot instruct the ALB listener to insert a custom application header signalling authentication. D requires the company to build, patch, scale and pay for a self-managed inline inspection appliance, which is the least operationally efficient option and does not sit in front of CloudFront."
 },
 {
  "id": "dt-66",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Transit Gateway route tables",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has created three VPCs: a production VPC, a nonproduction VPC, and a shared services VPC. The production VPC and the nonproduction VPC must each have communication with the shared services VPC. There must be no communication between the production VPC and the nonproduction VPC. A transit gateway is deployed to facilitate communication between VPCs. Which route table configurations on the transit gateway will meet these requirements?",
  "choices": {
   "A": "Configure a route table with the production and nonproduction VPC attachments associated with propagated routes for only the shared services VPC. Create an additional route table with only the shared services VPC attachment associated with propagated routes from the production and nonproduction VPCs.",
   "B": "Configure a route table with the production and nonproduction VPC attachments associated with propagated routes for each VPC. Create an additional route table with only the shared services VPC attachment associated with propagated routes from each VPC.",
   "C": "Configure a route table with all the VPC attachments associated with propagated routes for only the shared services VPC. Create an additional route table with only the shared services VPC attachment associated with propagated routes from the production and nonproduction VPCs.",
   "D": "Configure a route table with the production and nonproduction VPC attachments associated with propagated routes disabled. Create an additional route table with only the shared services VPC attachment associated with propagated routes from the production and nonproduction VPCs."
  },
  "answer": [
   "A"
  ],
  "explanation": "Transit Gateway isolation is achieved by controlling which attachments are associated with which route table and which attachments propagate routes into it. Associating the production and nonproduction attachments with one route table that only receives propagated routes from the shared services VPC means neither spoke has a route to the other, so their traffic is dropped at the transit gateway. A second route table associated only with the shared services attachment, receiving propagations from both production and nonproduction, gives shared services return paths to both. Option B propagates every VPC's routes into the shared spoke table, which would let production and nonproduction reach each other. Option C associates all three attachments with the same first route table, which both breaks the intended separation and conflicts with the second table (an attachment can be associated with only one route table). Option D disables propagation entirely on the spoke table, so production and nonproduction would have no route to shared services at all."
 },
 {
  "id": "dt-67",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Accelerated Site-to-Site VPN",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is using an AWS Site-to-Site VPN connection from the company's on-premises data center to a virtual private gateway in the AWS Cloud Because of congestion, the company is experiencing availability and performance issues as traffic travels across the internet before the traffic reaches AWS. A network engineer must reduce these issues for the connection as quickly as possible with minimum administration effort. Which solution will meet these requirements?",
  "choices": {
   "A": "Edit the existing Site-to-Site VPN connection by enabling acceleration. Stop and start the VPN service on the customer gateway for the new setting to take effect.",
   "B": "Configure a transit gateway in the same AWS Region as the existing virtual private gateway. Create a new accelerated Site-to-Site VPN connection. Connect the new connection to the transit gateway by using a VPN attachment. Update the customer gateway device to use the new Site to Site VPN connection. Delete the existing Site-to-Site VPN connection.",
   "C": "Create a new accelerated Site-to-Site VPN connection. Connect the new Site-to-Site VPN connection to the existing virtual private gateway. Update the customer gateway device to use the new Site-to-Site VPN connection. Delete the existing Site-to-Site VPN connection.",
   "D": "Create a new AWS Direct Connect connection with a private VIF between the on-premises data center and the AWS Cloud. Update the customer gateway device to use the new Direct Connect connection. Delete the existing Site-to-Site VPN connection."
  },
  "answer": [
   "B"
  ],
  "explanation": "Accelerated Site-to-Site VPN uses AWS Global Accelerator so tunnel traffic enters the AWS global network at the nearest edge location, bypassing congested internet paths, and this feature is supported only on VPN connections attached to a transit gateway, never on a virtual private gateway. The engineer must therefore create a transit gateway in the same Region, attach the existing VPC, create a new accelerated VPN as a transit gateway VPN attachment, repoint the customer gateway, and delete the old connection. C is the trap answer: acceleration cannot be enabled on a VGW-attached VPN. A is doubly wrong because acceleration cannot be toggled on an existing connection at all (it is set only at creation) and cannot be applied to a VGW. D would improve performance but ordering and provisioning a Direct Connect circuit takes weeks, which conflicts with the 'as quickly as possible' requirement."
 },
 {
  "id": "dt-68",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Transit Gateway peering",
  "difficulty": "easy",
  "multi": false,
  "question": "An Australian ecommerce company hosts all of its services in the AWS Cloud and wants to expand its customer base to the United States (US). The company is targeting the western US for the expansion. The company's existing AWS architecture consists of four AWS accounts with multiple VPCs deployed in the ap-southeast-2 Region. All VPCs are attached to a transit gateway in ap-southeast-2. There are dedicated VPCs for each application service. The company also has VPCs for centralized security features such as proxies, firewalls, and logging. The company plans to duplicate the infrastructure from ap-southeast-2 to the us-west-1 Region. A network engineer must establish connectivity between the various applications in the two Regions. The solution must maximize bandwidth, minimize latency and minimize operational overhead. Which solution will meet these requirements?",
  "choices": {
   "A": "Create VPN attachments between the two transit gateways. Configure the VPN attachments to use BGP routing between the two transit gateways.",
   "B": "Peer the transit gateways in each Region. Configure routing between the two transit gateways for each Region's IP addresses.",
   "C": "Create a VPN server in a VPC in each Region. Update the routing to point to the VPN servers for the IP addresses in alternate Regions.",
   "D": "Attach the VPCs in us-west-1 to the transit gateway in ap-southeast-2."
  },
  "answer": [
   "B"
  ],
  "explanation": "Inter-Region transit gateway peering is the native, fully managed way to interconnect transit gateways in different Regions: traffic traverses the AWS global backbone rather than the public internet, is encrypted in transit by default, supports jumbo frames up to 8500 bytes, and has no VPN tunnel bandwidth ceiling - which maximizes bandwidth, minimizes latency, and involves only a peering attachment plus static routes (B). A uses VPN attachments, which cap each tunnel at roughly 1.25 Gbps and add IPsec overhead and management. C requires building and operating self-managed VPN instances, the highest operational overhead and a single-instance bottleneck. D is not possible - a VPC can only be attached to a transit gateway in its own Region."
 },
 {
  "id": "dt-69",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Global Accelerator / BYOIP / NLB",
  "difficulty": "medium",
  "multi": false,
  "question": "An IoT company sells hardware sensor modules that periodically send out temperature, humidity, pressure, and location data through the MQTT messaging protocol. The hardware sensor modules send this data to the company's on-premises MQTT brokers that run on Linux servers behind a load balancer. The hardware sensor modules have been hardcoded with public IP addresses to reach the brokers. The company is growing and is acquiring customers across the world. The existing solution can no longer scale and is introducing additional latency because of the company's global presence. As a result, the company decides to migrate its entire infrastructure from on premises to the AWS Cloud. The company needs to migrate without reconfiguring the hardware sensor modules that are already deployed across the world. The solution also must minimize latency. The company migrates the MQTT brokers to run on Amazon EC2 instances. What should the company do next to meet these requirements?",
  "choices": {
   "A": "Place the EC2 instances behind a Network Load Balancer (NLB). Configure TCP listeners. Use Bring Your Own IP (BYOIP) from the on-premises network with the NLB.",
   "B": "Place the EC2 instances behind a Network Load Balancer (NLB). Configure TCP listeners. Create an AWS Global Accelerator accelerator in front of the NLUse Bring Your Own IP (BYOIP) from the on-premises network with Global Accelerator.",
   "C": "Place the EC2 instances behind an Application Load Balancer (ALB). Configure TCP listeners. Create an AWS Global Accelerator accelerator in front of the ALB. Use Bring Your Own IP (BYOIP) from the on-premises network with Global Accelerator.",
   "D": "Place the EC2 instances behind an Amazon CloudFront distribution. Use Bring Your Own IP (BYOIP) from the on-premises network with CloudFront."
  },
  "answer": [
   "B"
  ],
  "explanation": "The sensors have hardcoded public IPs, so the migrated endpoint must present those same addresses — this requires Bring Your Own IP, and AWS Global Accelerator supports advertising a customer-owned BYOIP range as the accelerator's static anycast addresses. Global Accelerator also solves the latency requirement by anycasting from the nearest edge location and carrying traffic over the AWS global backbone to the Region. Behind it, an NLB with TCP listeners is the correct layer 4 choice for MQTT, which is a persistent TCP protocol, so B is correct. A is wrong because an NLB cannot use BYOIP addresses directly — a BYOIP pool can be used for Elastic IPs on an NLB, but that provides no global latency optimization and would still be Region-anchored. C uses an ALB, which is HTTP/HTTPS only and has no TCP listener. D uses CloudFront, an HTTP/S content delivery service that cannot proxy MQTT and does not support BYOIP in this fashion."
 },
 {
  "id": "dt-70",
  "source": "ditectrev",
  "domain": 3,
  "topic": "ALB access logs / Athena",
  "difficulty": "easy",
  "multi": false,
  "question": "A company has deployed a web application on AWS. The web application uses an Application Load Balancer (ALB) across multiple Availability Zones. The targets of the ALB are AWS Lambda functions. The web application also uses Amazon CloudWatch metrics for monitoring. Users report that parts of the web application are not loading properly. A network engineer needs to troubleshoot the problem. The network engineer enables access logging for the ALB. What should the network engineer do next to determine which errors the ALB is receiving?",
  "choices": {
   "A": "Send the logs to Amazon CloudWatch Logs. Review the ALB logs in CloudWatch Insights to determine which error messages the ALB is receiving.",
   "B": "Configure the Amazon S3 bucket destination. Use Amazon Athena to determine which error messages the ALB is receiving.",
   "C": "Configure the Amazon S3 bucket destination. After Amazon CloudWatch Logs pulls the ALB logs from the S3 bucket automatically, review the logs in CloudWatch Logs to determine which error messages the ALB is receiving.",
   "D": "Send the logs to Amazon CloudWatch Logs. Use the Amazon Athena CloudWatch Connector to determine which error messages the ALB is receiving."
  },
  "answer": [
   "B"
  ],
  "explanation": "Application Load Balancer access logs can only be delivered to an Amazon S3 bucket - unlike VPC Flow Logs or Network Firewall logs, there is no CloudWatch Logs or Firehose destination for ELB access logs, which eliminates A and D. There is also no mechanism by which CloudWatch Logs automatically pulls objects out of an S3 bucket, so C is fabricated. The supported and AWS-documented analysis pattern is to point Amazon Athena at the S3 prefix with a table definition for the ALB log format and query fields such as elb_status_code, target_status_code and error_reason - which for Lambda targets surfaces errors like LambdaInvalidResponse or LambdaResponseTooLarge that explain why parts of the page fail to load. Note that ALB request-level errors are only visible in the access logs; CloudWatch metrics alone give counts, not the per-request error detail."
 },
 {
  "id": "dt-71",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Direct Connect encryption / private IP VPN",
  "difficulty": "hard",
  "multi": false,
  "question": "A company is planning to use Amazon S3 to archive financial data. The data is currently stored in an on-premises data center. The company uses AWS Direct Connect with a Direct Connect gateway and a transit gateway to connect to the on-premises data center. The data cannot be transported over the public internet and must be encrypted in transit. Which solution will meet these requirements?",
  "choices": {
   "A": "Create a Direct Connect public VIF. Set up an IPsec VPN connection over the public VIF to access Amazon S3. Use HTTPS for communication.",
   "B": "Create an IPsec VPN connection over the transit VIF. Create a VPC and attach the VPC to the transit gateway. In the VPC, provision an interface VPC endpoint for Amazon S3. Use HTTPS for communication.",
   "C": "Create a VPC and attach the VPC to the transit gateway. In the VPC, provision an interface VPC endpoint for Amazon S3. Use HTTPS for communication.",
   "D": "Create a Direct Connect public VIF. Set up an IPsec VPN connection over the public VIF to the transit gateway. Create an attachment for Amazon S3. Use HTTPS for communication."
  },
  "answer": [
   "B"
  ],
  "explanation": "Direct Connect traffic is not encrypted by AWS at the physical or network layer, so meeting an explicit encryption-in-transit requirement over an existing DX/DXGW/transit gateway design means layering IPsec on top. AWS Site-to-Site VPN supports private IP VPN over Direct Connect: the VPN terminates on private IP addresses reachable through a transit VIF and Direct Connect gateway attached to the transit gateway, giving an encrypted tunnel that never touches the internet. Attaching a VPC to the transit gateway and provisioning an interface VPC endpoint (AWS PrivateLink) for Amazon S3 in that VPC then lets on-premises hosts reach S3 by private IP with HTTPS, so no public S3 endpoint is used. Option C is the tempting choice and is fully private, but it provides no network-layer encryption over the Direct Connect link. Options A and D rely on a public VIF, and D invents a nonexistent 'attachment for Amazon S3' on a transit gateway."
 },
 {
  "id": "dt-72",
  "source": "ditectrev",
  "domain": 4,
  "topic": "Route 53 Resolver DNS Firewall",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is using Amazon Route 53 Resolver DNS Firewall in a VPC to block all domains except domains that are on an approved list. The company is concerned that if DNS Firewall is unresponsive, resources in the VPC might be affected if the network cannot resolve any DNS queries. To maintain application service level agreements, the company needs DNS queries to continue to resolve even if Route 53 Resolver does not receive a response from DNS Firewall. Which change should a network engineer implement to meet these requirements?",
  "choices": {
   "A": "Update the DNS Firewall VPC configuration to disable fail open for the VPC.",
   "B": "Update the DNS Firewall VPC configuration to enable fail open for the VPC.",
   "C": "Create a new DHCP options set with parameter dns_firewall_fail_open=false. Associate the new DHCP options set with the VPC.",
   "D": "Create a new DHCP options set with parameter dns_firewall_fail_open=true. Associate the new DHCP options set with the VPC."
  },
  "answer": [
   "B"
  ],
  "explanation": "Route 53 Resolver DNS Firewall has a per-VPC FirewallFailOpen setting that controls resolver behavior when DNS Firewall does not return a response. With fail open enabled, Route 53 Resolver continues to resolve the query normally instead of failing the lookup, which preserves application availability at the cost of temporarily unfiltered DNS, and that is exactly the trade-off the company chose. A is the opposite behavior: fail closed (the default) causes Resolver to fail the query when DNS Firewall is unresponsive. C and D are fabricated, since DHCP options sets only carry parameters such as domain-name, domain-name-servers, ntp-servers, and netbios settings, and contain no DNS Firewall option."
 },
 {
  "id": "dt-73",
  "source": "ditectrev",
  "domain": 1,
  "topic": "NLB/ALB TLS",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is migrating an existing application to a new AWS account. The company will deploy the application in a single AWS Region by using one VPC and multiple Availability Zones. The application will run on Amazon EC2 instances. Each Availability Zone will have several EC2 instances. The EC2 instances will be deployed in private subnets. The company's clients will connect to the application by using a web browser with the HTTPS protocol. Inbound connections must be distributed across the Availability Zones and EC2 instances. All connections from the same client session must be connected to the same EC2 instance. The company must provide end-to-end encryption for all connections between the clients and the application by using the application SSL certificate. Which solution will meet these requirements?",
  "choices": {
   "A": "Create a Network Load Balancer. Create a target group. Set the protocol to TCP and the port to 443 for the target group. Turn on session affinity (sticky sessions). Register the EC2 instances as targets. Create a listener. Set the protocol to TCP and the port to 443 for the listener. Deploy SSL certificates to the EC2 instances.",
   "B": "Create an Application Load Balancer. Create a target group. Set the protocol to HTTP and the port to 80 for the target group. Turn on session affinity (sticky sessions) with an application-based cookie policy. Register the EC2 instances as targets. Create an HTTPS listener. Set the default action to forward to the target group. Use AWS Certificate Manager (ACM) to create a certificate for the listener.",
   "C": "Create a Network Load Balancer. Create a target group. Set the protocol to TLS and the port to 443 for the target group. Turn on session affinity (sticky sessions). Register the EC2 instances as targets. Create a listener. Set the protocol to TLS and the port to 443 for the listener. Use AWS Certificate Manager (ACM) to create a certificate for the application.",
   "D": "Create an Application Load Balancer. Create a target group. Set the protocol to HTTPS and the port to 443 for the target group. Turn on session affinity (sticky sessions) with an application-based cookie policy. Register the EC2 instances as targets. Create an HTTP listener. Set the port to 443 for the listener. Set the default action to forward to the target group."
  },
  "answer": [
   "A"
  ],
  "explanation": "End-to-end encryption using the application's own SSL certificate requires that TLS is never terminated at the load balancer, so a Network Load Balancer with a TCP:443 listener forwarding to a TCP:443 target group simply passes the encrypted stream through to the EC2 instances, which present their own certificates (A). NLB target groups support sticky sessions via source IP affinity, satisfying the requirement that a client session always reaches the same instance, and the cross-AZ target registration distributes connections across Availability Zones. C breaks the requirement because a TLS listener terminates the session at the NLB with an ACM certificate rather than the application's certificate. B and D both terminate HTTPS at an ALB: B re-sends traffic in cleartext HTTP to the targets, and D is technically invalid (an HTTP listener on port 443 with HTTPS targets), so neither provides true end-to-end encryption with the application certificate."
 },
 {
  "id": "dt-74",
  "source": "ditectrev",
  "domain": 1,
  "topic": "NLB Static IPs",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is developing an application in which IoT devices will report measurements to the AWS Cloud. The application will have millions of end users. The company observes that the IoT devices cannot support DNS resolution. The company needs to implement an Amazon EC2 Auto Scaling solution so that the IoT devices can connect to an application endpoint without using DNS. Which solution will meet these requirements MOST cost-effectively?",
  "choices": {
   "A": "Use an Application Load Balancer (ALB)-type target group for a Network Load Balancer (NLB). Create an EC2 Auto Scaling group. Attach the Auto Scaling group to the ALB. Set up the IoT devices to connect to the IP addresses of the NLB.",
   "B": "Use an AWS Global Accelerator accelerator with an Application Load Balancer (ALB) endpoint. Create an EC2 Auto Scaling group. Attach the Auto Scaling group to the ALSet up the IoT devices to connect to the IP addresses of the accelerator.",
   "C": "Use a Network Load Balancer (NLB). Create an EC2 Auto Scaling group. Attach the Auto Scaling group to the NLB. Set up the IoT devices to connect to the IP addresses of the NLB.",
   "D": "Use an AWS Global Accelerator accelerator with a Network Load Balancer (NLB) endpoint. Create an EC2 Auto Scaling group. Attach the Auto Scaling group to the NLB. Set up the IoT devices to connect to the IP addresses of the accelerator."
  },
  "answer": [
   "C"
  ],
  "explanation": "A Network Load Balancer is assigned a static IP address per Availability Zone (and can use Elastic IPs), so devices that cannot perform DNS resolution can be pointed straight at those IPs, and it scales to millions of connections while the Auto Scaling group registers instances into the target group. That satisfies the requirement at the lowest cost, making C correct. B and D add AWS Global Accelerator, which does supply static anycast IPs but adds a fixed hourly accelerator charge plus per-GB data transfer premium — unnecessary cost when only static addressing was requested, and B further compounds it by fronting an ALB. A is convoluted and still costs two load balancers; an ALB-type target group behind an NLB is a valid feature but adds no benefit here, and the ALB itself only has DNS-resolvable, changing IPs."
 },
 {
  "id": "dt-75",
  "source": "ditectrev",
  "domain": 1,
  "topic": "AWS Global Accelerator",
  "difficulty": "easy",
  "multi": false,
  "question": "A company has deployed a new web application on Amazon EC2 instances behind an Application Load Balancer (ALB). The instances are in an Amazon EC2 Auto Scaling group. Enterprise customers from around the world will use the application. Employees of these enterprise customers will connect to the application over HTTPS from office locations. The company must configure firewalls to allow outbound traffic to only approved IP addresses. The employees of the enterprise customers must be able to access the application with the least amount of latency. Which change should a network engineer make in the infrastructure to meet these requirements?",
  "choices": {
   "A": "Create a new Network Load Balancer (NLB). Add the ALB as a target of the NLB.",
   "B": "Create a new Amazon CloudFront distribution. Set the ALB as the distribution's origin.",
   "C": "Create a new accelerator in AWS Global Accelerator. Add the ALB as an accelerator endpoint.",
   "D": "Create a new Amazon Route 53 hosted zone. Create a new record to route traffic to the ALB."
  },
  "answer": [
   "C"
  ],
  "explanation": "The binding requirement is that the customers' corporate firewalls must allow outbound traffic to only a small, stable set of approved IP addresses, while still delivering the lowest possible latency worldwide. AWS Global Accelerator provides two static anycast IPv4 addresses that never change for the life of the accelerator - perfect for customer firewall allowlists - and it ingests traffic at the nearest AWS edge location, then carries it over the AWS global backbone to the ALB endpoint, minimizing latency and jitter. CloudFront (B) also uses the edge network but its edge IP addresses come from large, periodically changing published ranges, which makes narrow firewall allowlisting impractical, and it is optimized for cacheable HTTP content rather than this dynamic enterprise app. An NLB fronting an ALB (A) gives static IPs but only in one Region with no edge proximity benefit. A Route 53 record (D) changes name resolution only; the ALB's IP addresses still rotate."
 },
 {
  "id": "dt-76",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Centralized VPC endpoints and DNS",
  "difficulty": "hard",
  "multi": false,
  "question": "A company has hundreds of VPCs on AWS. All the VPCs access the public endpoints of Amazon S3 and AWS Systems Manager through NAT gateways. All the traffic from the VPCs to Amazon S3 and Systems Manager travels through the NAT gateways. The company's network engineer must centralize access to these services and must eliminate the need to use public endpoints. Which solution will meet these requirements with the LEAST operational overhead?",
  "choices": {
   "A": "Create a central egress VPC that has private NAT gateways. Connect all the VPCs to the central egress VPC by using AWS Transit Gateway. Use the private NAT gateways to connect to Amazon S3 and Systems Manager by using private IP addresses.",
   "B": "Create a central shared services VPC. In the central shared services VPC, create interface VPC endpoints for Amazon S3 and Systems Manager to access. Ensure that private DNS is turned off. Connect all the VPCs to the central shared services VPC by using AWS Transit Gateway. Create an Amazon Route 53 forwarding rule for each interface VPC endpoint. Associate the forwarding rules with all the VPCs. Forward DNS queries to the interface VPC endpoints in the shared services VPC.",
   "C": "Create a central shared services VPC. In the central shared services VPC, create interface VPC endpoints for Amazon S3 and Systems Manager to access. Ensure that private DNS is turned off. Connect all the VPCs to the central shared services VPC by using AWS Transit Gateway. Create an Amazon Route 53 private hosted zone with a full service endpoint name for Amazon S3 and Systems Manager. Associate the private hosted zones with all the VPCs. Create an alias record in each private hosted zone with the full AWS service endpoint pointing to the interface VPC endpoint in the shared services VPC.",
   "D": "Create a central shared services VPC. In the central shared services VPC, create interface VPC endpoints for Amazon S3 and Systems Manager to access. Connect all the VPCs to the central shared services VPC by using AWS Transit Gateway. Ensure that private DNS is turned on for the interface VPC endpoints and that the transit gateway is created with DNS support turned on."
  },
  "answer": [
   "C"
  ],
  "explanation": "Interface endpoint private DNS only overrides the public service name inside the VPC that hosts the endpoint, so with hundreds of spoke VPCs reaching a central shared services VPC over Transit Gateway, private DNS must be turned off and DNS solved explicitly. The supported pattern is a Route 53 private hosted zone for each full service endpoint name (for example s3.us-east-1.amazonaws.com and ssm.us-east-1.amazonaws.com) associated with all the VPCs, containing an alias record that points to the regional DNS name of the centralized interface endpoint. That resolves the service name to the endpoint ENI IPs in the shared services VPC, which the spokes reach privately over the transit gateway, eliminating both the NAT gateways and the public endpoints. Option D fails because turning on private DNS does not propagate resolution to other VPCs, and a transit gateway does not perform DNS resolution. Option B is wrong because Resolver forwarding rules require an outbound endpoint and forward to target DNS server IPs, not to VPC endpoints, adding cost and complexity without solving resolution. Option A still uses public service endpoints, which the requirement forbids."
 },
 {
  "id": "dt-77",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Route 53 private hosted zones",
  "difficulty": "easy",
  "multi": false,
  "question": "A company manages resources across VPCs in multiple AWS Regions. The company needs to connect to the resources by using its internal domain name. A network engineer needs to apply the aws.example.com DNS suffix to all resources. What must the network engineer do to meet this requirement?",
  "choices": {
   "A": "Create an Amazon Route 53 private hosted zone for aws.example.com in each Region that has resources. Associate the private hosted zone with that Region's VPC. In the appropriate private hosted zone, create DNS records for the resources in each Region.",
   "B": "Create one Amazon Route 53 private hosted zone for aws.example.com. Configure the private hosted zone to allow zone transfers with every VPC.",
   "C": "Create one Amazon Route 53 private hosted zone for example.com. Create a single resource record for aws.example.com in the private hosted zone. Apply a multivalue answer routing policy to the record. Add all VPC resources as separate values in the routing policy.",
   "D": "Create one Amazon Route 53 private hosted zone for aws.example.com. Associate the private hosted zone with every VPC that has resources. In the private hosted zone, create DNS records for all resources."
  },
  "answer": [
   "D"
  ],
  "explanation": "A Route 53 private hosted zone is a global resource, not a Regional one, and a single hosted zone for aws.example.com can be associated with many VPCs across multiple Regions and even multiple accounts, so one zone holding records for every resource is all that is needed. Records in that zone resolve for any queries originating from any associated VPC that has DNS hostnames and DNS resolution enabled. A works but is unnecessarily redundant, and multiple private hosted zones with the same name associated with overlapping VPCs create authoritative-zone conflicts and a maintenance burden. B is invalid because Route 53 private hosted zones do not support zone transfers (AXFR); VPC association is the mechanism. C misuses multivalue answer routing, which returns up to eight random healthy IPs for a single name and cannot give each resource its own distinct hostname under the suffix."
 },
 {
  "id": "dt-78",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Route 53 Resolver",
  "difficulty": "medium",
  "multi": false,
  "question": "An insurance company is planning the migration of workloads from its on-premises data center to the AWS Cloud. The company requires end-to-end domain name resolution. Bi-directional DNS resolution between AWS and the existing on-premises environments must be established. The workloads will be migrated into multiple VPCs. The workloads also have dependencies on each other, and not all the workloads will be migrated at the same time. Which solution meets these requirements?",
  "choices": {
   "A": "Configure a private hosted zone for each application VPC, and create the requisite records. Create a set of Amazon Route 53 Resolver inbound and outbound endpoints in an egress VPC. Define Route 53 Resolver rules to forward requests for the on-premises domains to the on-premises DNS resolver. Associate the application VPC private hosted zones with the egress VPC, and share the Route 53 Resolver rules with the application accounts by using AWS Resource Access Manager. Configure the on-premises DNS servers to forward the cloud domains to the Route 53 inbound endpoints.",
   "B": "Configure a public hosted zone for each application VPC, and create the requisite records. Create a set of Amazon Route 53 Resolver inbound and outbound endpoints in an egress VPC. Define Route 53 Resolver rules to forward requests for the on-premises domains to the on-premises DNS resolver. Associate the application VPC private hosted zones with the egress VPC. and share the Route 53 Resolver rules with the application accounts by using AWS Resource Access Manager. Configure the on-premises DNS servers to forward the cloud domains to the Route 53 inbound endpoints.",
   "C": "Configure a private hosted zone for each application VPC, and create the requisite records. Create a set of Amazon Route 53 Resolver inbound and outbound endpoints in an egress VPC. Define Route 53 Resolver rules to forward requests for the on-premises domains to the on-premises DNS resolver. Associate the application VPC private hosted zones with the egress VPC and share the Route 53 Resolver rules with the application accounts by using AWS Resource Access Manager. Configure the on-premises DNS servers to forward the cloud domains to the Route 53 outbound endpoints.",
   "D": "Configure a private hosted zone for each application VPC, and create the requisite records. Create a set of Amazon Route 53 Resolver inbound and outbound endpoints in an egress VPC. Define Route 53 Resolver rules to forward requests for the on-premises domains to the on-premises DNS resolver. Associate the Route 53 outbound rules with the application VPCs, and share the private hosted zones with the application accounts by using AWS Resource Access Manager. Configure the on-premises DNS servers to forward the cloud domains to the Route 53 inbound endpoints."
  },
  "answer": [
   "A"
  ],
  "explanation": "Bi-directional hybrid DNS needs both halves of Route 53 Resolver: outbound endpoints with forwarding rules that send queries for on-premises domains to the on-premises resolvers, and inbound endpoints that on-premises DNS servers conditionally forward AWS-hosted zone queries to (A). Private hosted zones hold the records for each application VPC and are associated with the shared egress VPC so the inbound endpoint can resolve them, while the resolver rules are shared to the application accounts with AWS RAM and associated with their VPCs - this lets workloads resolve each other and on-premises names regardless of migration order. B is wrong because public hosted zones would publish internal records to the internet and cannot answer for private addresses appropriately. C fails because on-premises servers must forward to the inbound endpoint IPs; outbound endpoints only send queries out of the VPC and do not accept queries. D reverses the sharing model - Resolver rules, not private hosted zones, are the RAM-shareable resource in this design, and it omits associating the application PHZs with the egress VPC that hosts the inbound endpoint."
 },
 {
  "id": "dt-79",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Accelerated Site-to-Site VPN",
  "difficulty": "medium",
  "multi": false,
  "question": "A global company runs business applications in the us-east-1 Region inside a VPC. One of the company's regional offices in London uses a virtual private gateway for an AWS Site-to-Site VPN connection to the VPC. The company has configured a transit gateway and has set up peering between the VPC and other VPCs that various departments in the company use. Employees at the London office are experiencing latency issues when they connect to the business applications. What should a network engineer do to reduce this latency?",
  "choices": {
   "A": "Create a new Site-to-Site VPN connection. Set the transit gateway as the target gateway. Enable acceleration on the new Site-to-Site VPN connection. Update the VPN device in the London office with the new connection details.",
   "B": "Modify the existing Site-to-Site VPN connection by setting the transit gateway as the target gateway. Enable acceleration on the existing Site-to-Site VPN connection.",
   "C": "Create a new transit gateway in the eu-west-2 (London) Region. Peer the new transit gateway with the existing transit gateway. Modify the existing Site-to-Site VPN connection by setting the new transit gateway as the target gateway.",
   "D": "Create a new AWS Global Accelerator standard accelerator that has an endpoint of the Site-to-Site VPN connection. Update the VPN device in the London office with the new connection details."
  },
  "answer": [
   "A"
  ],
  "explanation": "Accelerated Site-to-Site VPN routes tunnel traffic to the nearest AWS edge location and then across the AWS global backbone, which materially reduces latency and jitter for distant offices such as London. Acceleration can only be enabled at VPN creation time — it cannot be turned on for an existing connection — and it is supported only on VPN connections terminating on a transit gateway, not on a virtual private gateway. Since the existing VPN terminates on a VGW, the engineer must create a new accelerated Site-to-Site VPN attached to the transit gateway and repoint the London customer gateway device, so A is correct. B is impossible for both reasons above (target gateway cannot be changed and acceleration cannot be retrofitted). C adds a second transit gateway and peering but leaves the internet path from London to the VPN endpoint unchanged. D is unsupported — Global Accelerator cannot front a Site-to-Site VPN endpoint; acceleration for VPN is delivered through the accelerated VPN feature itself."
 },
 {
  "id": "dt-80",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Interface VPC endpoints / hybrid DNS",
  "difficulty": "hard",
  "multi": true,
  "question": "A company has a hybrid cloud environment. The company's data center is connected to the AWS Cloud by an AWS Direct Connect connection. The AWS environment includes VPCs that are connected together in a hub-and-spoke model by a transit gateway. The AWS environment has a transit VIF with a Direct Connect gateway for on-premises connectivity. The company has a hybrid DNS model. The company has configured Amazon Route 53 Resolver endpoints in the hub VPC to allow bidirectional DNS traffic flow. The company is running a backend application in one of the VPCs. The company uses a message-oriented architecture and employs Amazon Simple Queue Service (Amazon SQS) to receive messages from other applications over a private network. A network engineer wants to use an interface VPC endpoint for Amazon SQS for this architecture. Client services must be able to access the endpoint service from on premises and from multiple VPCs within the company's AWS infrastructure. Which combination of steps should the network engineer take to ensure that the client applications can resolve DNS for the interface endpoint? (Choose three.)",
  "choices": {
   "A": "Create the interface endpoint for Amazon SQS with the option for private DNS names turned on.",
   "B": "Create the interface endpoint for Amazon SQS with the option for private DNS names turned off.",
   "C": "Manually create a private hosted zone for sqs.us-east-1.amazonaws.com. Add necessary records that point to the interface endpoint. Associate the private hosted zones with other VPCs.",
   "D": "Use the automatically created private hosted zone for sqs.us-east-1.amazonaws.com with previously created necessary records that point to the interface endpoint. Associate the private hosted zones with other VPCs.",
   "E": "Access the SQS endpoint by using the public DNS name sqs.us-east-1.amazonaws.com in VPCs and on premises.",
   "F": "Access the SQS endpoint by using the private DNS name of the interface endpoint, vpce-xxxxxxxx.sqs.us-east-1.vpce.amazonaws.com, in VPCs and on premises."
  },
  "answer": [
   "B",
   "C",
   "F"
  ],
  "explanation": "When you enable private DNS on an interface endpoint, AWS creates a managed private hosted zone that is bound to the endpoint's own VPC and cannot be associated with other VPCs, which is why D is wrong and why the option must be turned off (B) for a shared, multi-VPC and on-premises design. Instead you build your own private hosted zone for sqs.<region>.amazonaws.com, add records (typically an alias/CNAME for the sqs record pointing at the endpoint) and associate that hosted zone with every VPC that needs it (C); the existing Route 53 Resolver inbound endpoint in the hub VPC then lets on-premises DNS forwarders resolve the same name over the Direct Connect transit VIF. The records in that zone - and the name clients can always use directly from any VPC or from on premises - are the endpoint-specific regional DNS names of the form vpce-xxxx.sqs.<region>.vpce.amazonaws.com (F). E is wrong because resolving the public sqs endpoint name without private DNS returns public IP addresses and sends traffic over the internet or NAT rather than through the interface endpoint, and A is wrong because private DNS names cannot be shared beyond the endpoint VPC."
 },
 {
  "id": "dt-81",
  "source": "ditectrev",
  "domain": 4,
  "topic": "AWS Config / compliance governance",
  "difficulty": "easy",
  "multi": false,
  "question": "A company's network engineer builds and tests network designs for VPCs in a development account. The company needs to monitor the changes that are made to network resources and must ensure strict compliance with network security policies. The company also needs access to the historical configurations of network resources. Which solution will meet these requirements?",
  "choices": {
   "A": "Create an Amazon EventBridge (Amazon CloudWatch Events) rule with a custom pattern to monitor the account for changes. Configure the rule to invoke an AWS Lambda function to identify noncompliant resources. Update an Amazon DynamoDB table with the changes that are identified.",
   "B": "Create custom metrics from Amazon CloudWatch logs. Use the metrics to invoke an AWS Lambda function to identify noncompliant resources. Update an Amazon DynamoDB table with the changes that are identified.",
   "C": "Record the current state of network resources by using AWS Config. Create rules that reflect the desired configuration settings. Set remediation for noncompliant resources.",
   "D": "Record the current state of network resources by using AWS Systems Manager Inventory. Use Systems Manager State Manager to enforce the desired configuration settings and to carry out remediation for noncompliant resources."
  },
  "answer": [
   "C"
  ],
  "explanation": "AWS Config is the purpose-built service for recording configuration state and change history of AWS resources, including network resources such as VPCs, subnets, security groups, network ACLs, route tables, and load balancers. It maintains a configuration timeline and configuration item history, which directly satisfies the need for access to historical configurations, and AWS Config rules (managed or custom) continuously evaluate resources against desired network security policies with automatic remediation actions via Systems Manager Automation documents. Option A can detect changes in near real time via EventBridge but requires custom Lambda and DynamoDB code and provides no built-in configuration history or compliance framework. Option B is unrelated - CloudWatch metric filters operate on log data, not resource configuration. Option D is wrong because Systems Manager Inventory and State Manager manage software and OS-level configuration on managed instances, not the configuration of AWS network resources."
 },
 {
  "id": "dt-82",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Global Accelerator with ALB and WAF",
  "difficulty": "medium",
  "multi": false,
  "question": "A gaming company is planning to launch a globally available game that is hosted in one AWS Region. The game backend is hosted on Amazon EC2 instances that are part of an Auto Scaling group. The game uses the gRPC protocol for bidirectional streaming between game clients and the backend. The company needs to filter incoming traffic based on the source IP address to protect the game. Which solution will meet these requirements?",
  "choices": {
   "A": "Configure an AWS Global Accelerator accelerator with an Application Load Balancer (ALB) endpoint. Attach the ALB to the Auto Scaling group. Configure an AWS WAF web ACL for the ALB to filter traffic based on the source IP address.",
   "B": "Configure an AWS Global Accelerator accelerator with a Network Load Balancer (NLB) endpoint. Attach the NLB to the Auto Scaling group. Configure security groups for the EC2 instances to filter traffic based on the source IP address.",
   "C": "Configure an Amazon CloudFront distribution with an Application Load Balancer (ALB) endpoint. Attach the ALB to the Auto Scaling group. Configure an AWS WAF web ACL for the ALB to filter traffic based on the source IP address.",
   "D": "Configure an Amazon CloudFront distribution with a Network Load Balancer (NLB) endpoint. Attach the NLB to the Auto Scaling group. Configure security groups for the EC2 instances to filter traffic based on the source IP address."
  },
  "answer": [
   "A"
  ],
  "explanation": "gRPC runs over HTTP/2, and the Application Load Balancer natively supports HTTP/2 end to end and gRPC target group protocol version, including bidirectional streaming and gRPC-specific health checks and status codes. AWS WAF attaches to an ALB and its IP set match statements provide the required source IP filtering, while AWS Global Accelerator fronts the single-Region backend with anycast static IPs so global players enter the AWS backbone at the nearest edge, improving latency and availability. B is weaker because an NLB is Layer 4 and security group rules on the instances would see the Global Accelerator or preserved client IP but give only coarse, per-instance filtering with no managed rule capability; NLB also cannot terminate or understand HTTP/2. C and D fail because CloudFront is optimized for HTTP request/response caching and does not support long-lived bidirectional gRPC streaming, and CloudFront cannot use an NLB as an origin except as a custom TCP origin without HTTP semantics."
 },
 {
  "id": "dt-83",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Route 53 split-view DNS",
  "difficulty": "easy",
  "multi": false,
  "question": "A company has multiple VPCs in the us-east-1 Region. The company has deployed a website in one of the VPCs. The company wants to implement split-view DNS so that the website is accessible internally from the VPCs and externally over the internet with the same domain name, example.com. Which solution will meet these requirements?",
  "choices": {
   "A": "Change the DHCP options for each VPC to use the IP address of an on-premises DNS server. Create a private hosted zone and a public hosted zone for example.com. Map the private hosted zone to the website's internal IP address. Map the public hosted zone to the website's external IP address.",
   "B": "Create Amazon Route 53 private hosted zones and public hosted zones that have the same name, example.com. Associate the VPCs with the private hosted zone. Create records in each hosted zone that determine how traffic is routed.",
   "C": "Create an Amazon Route 53 Resolver inbound endpoint for resolving example.com internally. Create a Route 53 public hosted zone for routing external DNS queries.",
   "D": "Create an Amazon Route 53 Resolver outbound endpoint for resolving example.com externally. Create a Route 53 private hosted zone for routing internal DNS queries."
  },
  "answer": [
   "B"
  ],
  "explanation": "Split-view (split-horizon) DNS in Route 53 is implemented by creating a private hosted zone and a public hosted zone with the identical domain name, associating the VPCs with the private zone, and creating the appropriate records in each (B). Route 53 Resolver in an associated VPC always prefers the private hosted zone when the queried name matches, so internal clients get the internal address while internet clients receive the public zone's answer. A is wrong because pointing VPC DHCP options at an on-premises DNS server disables the Route 53 Resolver behavior that makes private hosted zones work and adds an unnecessary dependency. C and D misuse Resolver endpoints: inbound endpoints exist so external networks can query into the VPC, and outbound endpoints forward VPC queries to external resolvers - neither is needed or sufficient for split-view resolution among VPCs in the same Region."
 },
 {
  "id": "dt-84",
  "source": "ditectrev",
  "domain": 4,
  "topic": "NLB TLS Passthrough / Mutual TLS",
  "difficulty": "hard",
  "multi": false,
  "question": "A company has developed a new web application that processes confidential data that is hosted on Amazon EC2 instances. The application needs to scale and must use certificates to authenticate clients. The application is configured to request a client's certificate and will validate the certificate as part of the initial handshake. Which Elastic Load Balancing (ELB) solution will meet these requirements?",
  "choices": {
   "A": "Configure an Application Load Balancer (ALB) that includes an HTTPS listener on port 443. Create an Auto Scaling group for the EC2 instances. Configure the Auto Scaling group as the target group of the ALB. Configure HTTPS as the protocol for the target group.",
   "B": "Configure a Network Load Balancer (NLB) that includes a TLS listener on port 443. Create an Auto Scaling group for the EC2 instances. Configure the Auto Scaling group as the target group of the NLB. Configure the NLB to terminate TLS. Configure TLS as the protocol for the target group.",
   "C": "Configure a Network Load Balancer (NLB) that includes a TCP listener on port 443. Create an Auto Scaling group for the EC2 instances. Configure the Auto Scaling group as the target group of the NLB. Configure TCP as the protocol for the target group.",
   "D": "Configure an Application Load Balancer (ALB) that includes a TLS listener on port 443. Create an Auto Scaling group for the EC2 instances. Configure the Auto Scaling group as the target group of the ALB. Configure TLS as the protocol for the target group."
  },
  "answer": [
   "C"
  ],
  "explanation": "The requirement states the application itself requests and validates the client certificate during the initial handshake, so the TLS session must terminate on the EC2 instances rather than on the load balancer. A Network Load Balancer with a TCP listener on port 443 passes the encrypted stream through untouched, letting the backend complete mutual TLS, and it scales with an Auto Scaling group registered in the target group — this is option C. Option A terminates TLS on the ALB and re-encrypts to the targets, so the client certificate never reaches the application. Option B terminates TLS on the NLB, which likewise breaks end-to-end client certificate validation by the application. Option D, which is the answer key published in the source question set, is not implementable as written: an Application Load Balancer supports only HTTP and HTTPS listener protocols — there is no TLS listener type on an ALB, and TLS is not a valid ALB target group protocol. (ALB does support mutual TLS today, but through an HTTPS listener with an mTLS trust store, which is still LB-side validation rather than the application-side validation described.) This app therefore grades C as correct.",
  "answer_disputed": true,
  "source_answer": [
   "D"
  ]
 },
 {
  "id": "dt-85",
  "source": "ditectrev",
  "domain": 1,
  "topic": "S3 interface endpoint / hybrid access",
  "difficulty": "medium",
  "multi": false,
  "question": "A company collects a high volume of shipping data and stores the data in an on-premises data center. A network engineer wants to use Amazon S3 to store the data during the first phase of a migration to AWS. During this phase, an application that resides in the data center will need to access the data privately in an S3 bucket that the company created. The company has set up an AWS Direct Connect connection with a private VIF to connect the on-premises data center to a VPC. The network engineer plans to use this Direct Connect connection forthe hybrid cloud setup. The solution must be highly available. What should the network engineer do next to implement this architecture?",
  "choices": {
   "A": "Configure an S3 gateway endpoint in the VPC. Update VPC route tables to route traffic to the S3 gateway endpoint. Configure the S3 gateway endpoint DNS name in the on-premises application.",
   "B": "Configure an S3 interface endpoint in the VPC. Configure the S3 interface endpoint DNS name in the on-premises application.",
   "C": "Configure an S3 gateway endpoint in the VPC. Update VPC route tables to route traffic to the S3 gateway endpoint. Configure an HTTP proxy on an Amazon EC2 instance in the VPC to route traffic to the S3 gateway endpoint. Configure the HTTP proxy DNS name in the on-premises application.",
   "D": "Configure an S3 interface endpoint in the VPC. Update VPC route tables to route traffic to the S3 interface endpoint. Configure an HTTP proxy on an Amazon EC2 instance in the VPC to route traffic to the S3 interface endpoint. Configure the HTTP proxy DNS name in the on-premises application."
  },
  "answer": [
   "B"
  ],
  "explanation": "Gateway endpoints for Amazon S3 work purely through VPC route table prefix-list entries, and those routes are not advertised to or usable by on-premises networks over Direct Connect or VPN, so any answer built on a gateway endpoint (A and C) cannot serve the data center directly. An S3 interface endpoint powered by AWS PrivateLink creates elastic network interfaces with private IP addresses inside the VPC subnets, and those private IPs are reachable from on premises across the private VIF; deploying the endpoint ENIs in multiple Availability Zones delivers the required high availability. The on-premises application simply targets the endpoint-specific regional DNS name (or resolves the S3 name through a Route 53 Resolver inbound endpoint), so no proxy is needed, which is why D's EC2 HTTP proxy is unnecessary extra cost and a single point of failure - and interface endpoints do not require VPC route table changes at all. C's proxy approach is a legacy workaround from before S3 interface endpoints existed."
 },
 {
  "id": "dt-86",
  "source": "ditectrev",
  "domain": 1,
  "topic": "Transit Gateway appliance mode",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is designing infrastructure on AWS with three VPCs connected to a transit gateway. Thethree VPCs are an application VPC, a backend VPC, and an inspection VPC. The application VPC and the backend VPC have compute instances deployed in Availability Zone A and Availability Zone B. Stateful firewalls are deployed in the same Availability Zones in the inspection VPC, which is a shared servicesVPC. All traffic is routed through the inspection VPC through the stateful layer 7 virtual firewall appliances to comply with a security policy that mandates traffic inspection. There are no overlapping IP addresses across the three VPCs. A network engineer must ensure that traffic between the application VPC and the backend VPC can route through the inspection VPC's stateful firewalls. Which solution will meet these requirements?",
  "choices": {
   "A": "Create IPsec VPN connections between the transit gateway and the virtual firewall appliances.",
   "B": "Configure Virtual Router Redundancy Protocol (VRRP) on the virtual firewall appliances.",
   "C": "Set up BGP between the transit gateway and the virtual firewall appliances.",
   "D": "Enable transit gateway appliance mode for the VPC attachment to the inspection VPC."
  },
  "answer": [
   "D"
  ],
  "explanation": "By default a transit gateway selects an Availability Zone for a flow and keeps traffic in that AZ, which means the forward and return directions of a flow between the application VPC and the backend VPC can be handed to firewall appliances in different AZs in the inspection VPC. A stateful Layer 7 appliance that sees only one direction of the flow drops the traffic. Enabling appliance mode on the inspection VPC attachment makes the transit gateway use a flow hash so that both directions of a given flow are consistently sent to the same AZ, preserving symmetry for the stateful firewalls. Option A (IPsec VPN attachments) and option C (BGP to the appliances) add routing complexity but do nothing to guarantee flow symmetry across AZs. Option B (VRRP) is not supported in a VPC because AWS networking does not support multicast-based gratuitous ARP failover of that kind, and it also does not solve AZ affinity at the transit gateway."
 },
 {
  "id": "dt-87",
  "source": "ditectrev",
  "domain": 4,
  "topic": "Route 53 DNSSEC and KMS",
  "difficulty": "hard",
  "multi": false,
  "question": "A company hosts a public hosted zone in Amazon Route 53. The company wants to configure DNS Security Extensions (DNSSEC) signing for the public hosted zone. All the company's business-critical applications are running in the us-west-2 Region. The company has created a symmetric, customer managed, single-Region key in us-west-2 by using AWS Key Management Service (AWS KMS). A network engineer finds that the existing AWS KMS key cannot be used to create a key-signing key (KSK). How can the network engineer resolve this issue?",
  "choices": {
   "A": "Recreate a symmetric, customer managed, multi-Region key in the us-east-1 Region. Use this key to create a KSK.",
   "B": "Recreate a symmetric, customer managed, single-Region key in us-west-2. Use this key to create a KSK.",
   "C": "Recreate an asymmetric, customer managed key with an ECC_NIST_P256 key spec in the us-east-1 Region. Use this key to create a KSK.",
   "D": "Recreate an asymmetric, customer managed key with an ECC_NIST_P256 key spec in us-west-2. Use this key to create a KSK."
  },
  "answer": [
   "C"
  ],
  "explanation": "Route 53 DNSSEC signing has two hard requirements for the key-signing key: the AWS KMS key must be an asymmetric customer managed key with the ECC_NIST_P256 key spec and a SIGN_VERIFY key usage, and it must reside in the us-east-1 Region regardless of where the workload runs, because Route 53 is a global service whose control plane is anchored in us-east-1. The existing symmetric us-west-2 key fails both conditions, so the fix is to create an ECC_NIST_P256 asymmetric key in us-east-1. B and D are wrong on Region (us-west-2 keys cannot be used for a KSK), and A and B are wrong on key type, since symmetric keys cannot perform the ECDSAP256SHA256 signing that DNSSEC requires. Multi-Region keys do not help either, because the requirement is the key's Region, not its replication capability."
 },
 {
  "id": "dt-88",
  "source": "ditectrev",
  "domain": 2,
  "topic": "Direct Connect BGP communities",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is migrating many applications from two on-premises data centers to AWS. The company's network team is setting up connectivity to the AWS environment. The migration will involve spreading the applications across two AWS Regions: us-east-1 and us-west-2. The company has set up AWS Direct Connect connections at two different locations. Direct Connect connection 1 is to the first data center and is at a location in us-east-1. Direct Connect connection 2 is to the second data center and is at a location in us-west-2. The company has connected both Direct Connect connections to a single Direct Connect gateway by using transit VIFs. The Direct Connect gateway is associated with transit gateways that are deployed in each Region. All traffic to and from AWS must travel through the first data center. In the event of failure, the second data center must take over the traffic. How should the network team configure BGP to meet these requirements?",
  "choices": {
   "A": "Configure the local preference BGP community tag 7224:7300 for the transit VIF connected to Direct Connect connection 1.",
   "B": "Configure the local preference BGP community tag 7224:9300 for the transit VIF connected to Direct Connect connection 2.",
   "C": "Use the AS_PATH attribute to prepend the additional hop for the transit VIF connected to Direct Connect connection 2.",
   "D": "Use the AS_PATH attribute to prepend the additional hop for the transit VIF connected to Direct Connect connection 1."
  },
  "answer": [
   "A"
  ],
  "explanation": "Local preference BGP community tags applied by the customer router to prefixes advertised toward AWS determine which Direct Connect path AWS prefers for traffic leaving AWS, and 7224:7300 is the highest preference value (7224:7100 low, 7224:7200 medium). Tagging the prefixes on the transit VIF of Direct Connect connection 1 with 7224:7300 makes the shared Direct Connect gateway prefer that path for both Regions' transit gateways, with automatic failover to connection 2 if connection 1's BGP session drops (A). B uses 7224:9300, which is a public VIF advertisement scope community (global) and has no path-preference meaning on a transit VIF. C and D rely on AS_PATH prepending, which is a valid tie-breaker but is evaluated only after local preference in BGP best-path selection and is not the AWS-recommended control here; D additionally prepends the wrong connection, which would push traffic to the secondary data center."
 },
 {
  "id": "dt-89",
  "source": "ditectrev",
  "domain": 3,
  "topic": "VPC Traffic Mirroring",
  "difficulty": "medium",
  "multi": false,
  "question": "An ecommerce company has a business-critical application that runs on Amazon EC2 instances in a VPC. The company's development team has been testing a new version of the application on test EC2 instances. The development team wants to test the new application version against production traffic to address any problems that might occur before the company releases the new version across all servers. Which solution will meet this requirement with no impact on the end user's experience?",
  "choices": {
   "A": "Configure Amazon Route 53 weighted routing policies by configuring records that have the same name and type as each of the instances. Assign relative weights to the production instances and the test instances.",
   "B": "Create an Application Load Balancer with weighted target groups. Add more than one target group to the forward action of a listener rule. Specify a weight for each target group.",
   "C": "Implement Traffic Mirroring to replay the production requests to the test instances. Configure the source as the production instances. Configure the target as the test instances.",
   "D": "Configure an NGINX proxy in front of the production servers. Use the NGINX mirroring capability."
  },
  "answer": [
   "C"
  ],
  "explanation": "VPC Traffic Mirroring copies inbound and outbound packets from a source ENI and sends the copy (VXLAN-encapsulated) to a target ENI or a Gateway Load Balancer endpoint, without affecting the original flow in any way. That lets the development team replay real production traffic against the test instances with zero impact on end users, which is why C is correct. A and B both steer a share of real user requests to the untested version — weighted Route 53 records and ALB weighted target groups are valid canary techniques, but any error in the new version would be experienced by real customers, violating the no-impact requirement. D inserts a self-managed NGINX proxy into the production request path, adding a new failure point and significant operational overhead compared to a native AWS feature."
 },
 {
  "id": "dt-90",
  "source": "ditectrev",
  "domain": 4,
  "topic": "Route 53 Resolver DNS Firewall",
  "difficulty": "easy",
  "multi": false,
  "question": "A company hosts its ecommerce application on Amazon EC2 instances behind an Application Load Balancer. The EC2 instances are in a private subnet with the default DHCP options set. Internet connectivity is through a NAT gateway that is configured in the public subnet. A third-party audit of the security infrastructure identifies a DNS exfiltration vulnerability. The company must implement a highly available solution that protects against this vulnerability. Which solution will meet these requirements MOST cost-effectively?",
  "choices": {
   "A": "Configure a BIND server with DNS filtering. Modify the DNS servers in the DHCP options set.",
   "B": "Use Amazon Route 53 Resolver DNS Firewall. Configure a domain list with a rule group.",
   "C": "Use AWS Network Firewall with domain name filtering.",
   "D": "Configure an Amazon Route 53 Resolver outbound endpoint with rules to filter and block suspicious traffic."
  },
  "answer": [
   "B"
  ],
  "explanation": "DNS exfiltration hides data inside DNS queries to attacker-controlled domains, and because the instances use the default DHCP options set every query goes to the Amazon-provided VPC Resolver (the .2 address). Route 53 Resolver DNS Firewall inspects exactly that outbound query path: you attach a rule group with domain lists to the VPC and ALLOW, BLOCK or ALERT on matching domain names, including AWS-managed lists such as AWSManagedDomainsMalwareDomainList and AWSManagedDomainsAggregateThreatList. It is a fully managed, inherently highly available regional service with no instances to run, making it the most cost-effective option. A requires self-managed BIND servers plus custom HA and patching. C can filter domains but AWS Network Firewall is priced per endpoint-hour plus data processed and would need routing changes to force traffic through inspection subnets, so it is more expensive for a DNS-only requirement. D is wrong in function: Resolver outbound endpoints and forwarding rules forward queries to external resolvers, they do not block or filter malicious domains."
 },
 {
  "id": "dt-91",
  "source": "ditectrev",
  "domain": 3,
  "topic": "Traffic Mirroring vs VPC Flow Logs",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants to analyze TCP traffic to the internet. The traffic originates from Amazon EC2 instances in the company's VPC. The EC2 instances initiate connections through a NAT gateway. The required information includes source and destination IP addresses, ports, and the first 8 bytes of payload of TCP segments. The company needs to collect, store, and analyze all the required data points. Which solution will meet these requirements?",
  "choices": {
   "A": "Set up the EC2 instances as VPC traffic mirror sources. Deploy software on the traffic mirror target to forward the data to Amazon CloudWatch Logs. Analyze the data by using CloudWatch Logs Insights.",
   "B": "Set up the NAT gateway as a VPC traffic mirror source. Deploy software on the traffic mirror target to forward the data to an Amazon OpenSearch Service cluster. Analyze the data by using OpenSearch Dashboards.",
   "C": "Turn on VPC Flow Logs on the EC2 instances. Specify the default format and a log destination of Amazon CloudWatch Logs. Analyze the flow log data by using CloudWatch Logs Insights.",
   "D": "Turn on VPC Flow Logs on the EC2 instances. Specify a custom format and a log destination of Amazon S3. Analyze the flow log data by using Amazon Athena."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC Flow Logs record only connection metadata - source and destination addresses, ports, protocol, packet and byte counts, and action - and never capture packet payload, so options C and D cannot satisfy the requirement to see the first 8 bytes of the TCP payload. VPC Traffic Mirroring copies actual packets from an elastic network interface, and the mirror filter/session lets you set a packet length so only the headers plus a defined number of payload bytes are captured, which is exactly the requirement. The mirror source must be an EC2 instance ENI, so the instances themselves are configured as sources; a NAT gateway ENI is not a supported traffic mirror source, which eliminates option B. Sending the decapsulated VXLAN data from the mirror target to CloudWatch Logs and querying with CloudWatch Logs Insights meets the collect, store, and analyze requirement."
 },
 {
  "id": "gen-a-1",
  "source": "authored",
  "domain": 1,
  "topic": "Direct Connect resiliency and SLA",
  "difficulty": "medium",
  "multi": false,
  "question": "A financial services company is migrating a latency-sensitive trading platform to AWS. The company signs an internal agreement that requires the hybrid connectivity between its data center and AWS to be covered by the highest available AWS Direct Connect service level agreement of 99.99 percent. The company already operates network equipment in two metropolitan areas that both host AWS Direct Connect locations. Cost is a secondary concern. Which solution will meet these requirements?",
  "choices": {
   "A": "Provision two dedicated connections at a single AWS Direct Connect location that terminate on two separate AWS devices, and combine them into a link aggregation group (LAG) with a minimum links value of 1.",
   "B": "Provision one dedicated connection at each of two different AWS Direct Connect locations, and add an AWS Site-to-Site VPN over the public internet as a third path.",
   "C": "Provision two dedicated connections at each of two different AWS Direct Connect locations, and make sure that the two connections at each location terminate on separate AWS devices.",
   "D": "Provision one dedicated 100 Gbps connection at a single AWS Direct Connect location, enable MACsec on the connection, and enable Bidirectional Forwarding Detection (BFD) on the BGP session."
  },
  "answer": [
   "C"
  ],
  "explanation": "The 99.99 percent Direct Connect SLA requires the maximum resiliency model: separate connections terminating on separate devices in more than one Direct Connect location, which is exactly what option C describes. Option A places all capacity in a single Direct Connect location, so a location-level failure takes down the entire path, and a LAG does not change the SLA tier. Option B is the high resiliency model, which is covered by the 99.9 percent SLA; adding an internet-based VPN does not raise the Direct Connect SLA because the SLA is measured on the Direct Connect connections themselves. Option D is a single point of failure; MACsec provides Layer 2 encryption and BFD only speeds up failure detection, neither improves the SLA tier."
 },
 {
  "id": "gen-a-2",
  "source": "authored",
  "domain": 1,
  "topic": "Multi-region Transit Gateway peering",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs workloads in the us-east-1 Region and the eu-west-1 Region. Each Region has an AWS Transit Gateway with several VPC attachments and a dedicated route table for production traffic. The company needs production VPCs in us-east-1 to reach production VPCs in eu-west-1 over the AWS backbone without traversing the public internet. A network engineer has already created and accepted a transit gateway peering attachment between the two transit gateways, but traffic still fails. What should the network engineer do to complete the configuration?",
  "choices": {
   "A": "Enable route propagation for the peering attachment on the production route table in each transit gateway so that the remote VPC CIDR blocks are learned automatically.",
   "B": "Add static routes for the remote Region VPC CIDR blocks that point to the peering attachment in the production route table of each transit gateway.",
   "C": "Create an AWS Transit Gateway Connect attachment on top of the peering attachment and establish a BGP session between the two transit gateways.",
   "D": "Create inter-Region VPC peering connections between each pair of production VPCs and update the VPC subnet route tables to point to the VPC peering connections."
  },
  "answer": [
   "B"
  ],
  "explanation": "Transit gateway peering attachments do not support dynamic route propagation, so routes for the remote Region must be added as static routes that reference the peering attachment in each transit gateway route table. Option A fails because propagation is unavailable on peering attachments. Option C is invalid because Transit Gateway Connect uses a VPC attachment or a Direct Connect transit VIF attachment as its transport, not a peering attachment, and it is intended for third-party SD-WAN appliances rather than transit gateway to transit gateway connectivity. Option D would work technically but requires a full mesh of VPC peering connections and abandons the transit gateway design, which does not meet the requirement to use the existing hub architecture."
 },
 {
  "id": "gen-a-3",
  "source": "authored",
  "domain": 1,
  "topic": "IP address planning and overlapping CIDRs",
  "difficulty": "hard",
  "multi": false,
  "question": "After acquiring a competitor, a company must connect the acquired company VPC to its on-premises data center through an existing AWS Transit Gateway that is attached to an AWS Direct Connect gateway. The acquired VPC uses the 10.10.0.0/16 CIDR block, which overlaps exactly with an on-premises data center range that cannot be renumbered. Applications in the acquired VPC must initiate outbound connections to on-premises servers in 10.10.50.0/24. Re-addressing the VPC is not an option because of hardcoded application dependencies. Which solution will meet these requirements?",
  "choices": {
   "A": "Add a secondary non-overlapping CIDR block to the VPC, create subnets in that block, deploy private NAT gateways in those subnets, and route on-premises destined traffic from the workload subnets through the private NAT gateways to the transit gateway attachment.",
   "B": "Create a VPC peering connection between the acquired VPC and the shared services VPC, and enable NAT on the peering connection for the overlapping range.",
   "C": "Attach the acquired VPC to the transit gateway and create a static route in the transit gateway route table for 10.10.50.0/24 that points to the Direct Connect gateway attachment, relying on longest prefix match to resolve the overlap.",
   "D": "Deploy an AWS Site-to-Site VPN from the acquired VPC virtual private gateway directly to the data center and enable inside tunnel address translation on the VPN connection."
  },
  "answer": [
   "A"
  ],
  "explanation": "A private NAT gateway placed in subnets that use a secondary, non-overlapping VPC CIDR block translates the source address of traffic leaving the acquired VPC, so on-premises devices see a unique routable address and the overlap is hidden; the transit gateway attachment is created in the non-overlapping subnets and only the non-overlapping prefix is advertised over Direct Connect. Option B is invalid because VPC peering does not support any form of NAT and does not work with overlapping CIDRs at all. Option C fails because longest prefix match cannot disambiguate an address that exists both locally in the VPC and remotely; the VPC local route always wins inside the VPC. Option D is invalid because Site-to-Site VPN does not provide address translation of inside tunnel traffic."
 },
 {
  "id": "gen-a-4",
  "source": "authored",
  "domain": 1,
  "topic": "Hybrid DNS with Route 53 Resolver",
  "difficulty": "medium",
  "multi": false,
  "question": "A company connects its data center to AWS with AWS Direct Connect. EC2 instances in several VPCs must resolve records in the on-premises domain corp.example.internal, which is served by two on-premises Microsoft DNS servers. On-premises servers must also resolve records in an Amazon Route 53 private hosted zone named aws.example.internal that is associated with the VPCs. The company wants a managed solution and does not want to run DNS forwarders on EC2 instances. What should a network engineer do?",
  "choices": {
   "A": "Create a Route 53 Resolver inbound endpoint and a forwarding rule for corp.example.internal that targets the inbound endpoint IP addresses, and configure the on-premises servers to forward aws.example.internal queries to the Amazon provided DNS address at the VPC CIDR base plus two.",
   "B": "Create a Route 53 Resolver outbound endpoint with a forwarding rule for corp.example.internal that targets the on-premises DNS server IP addresses, create a Route 53 Resolver inbound endpoint, and configure conditional forwarders on the on-premises DNS servers that point to the inbound endpoint IP addresses.",
   "C": "Create a Route 53 Resolver outbound endpoint and a system rule for corp.example.internal, and create a public hosted zone for aws.example.internal so that on-premises servers can resolve it over the internet.",
   "D": "Enable DNS resolution and DNS hostnames on all VPCs, associate the private hosted zone with the on-premises network by using a Route 53 Resolver DNS Firewall rule group, and create a delegation set for corp.example.internal."
  },
  "answer": [
   "B"
  ],
  "explanation": "Resolution from AWS to on-premises requires an outbound Resolver endpoint plus a conditional forwarding rule that lists the on-premises DNS server addresses, and resolution from on-premises to AWS requires an inbound Resolver endpoint whose elastic network interface IP addresses are used as conditional forwarder targets on the on-premises servers. Option A reverses the roles of the endpoints and relies on the VPC plus two Amazon provided DNS address, which is not reachable from outside the VPC. Option C is wrong because a system rule is used to exclude a domain from forwarding, and publishing internal records in a public hosted zone exposes private data. Option D is wrong because DNS Firewall filters queries and does not provide forwarding, and private hosted zones can only be associated with VPCs."
 },
 {
  "id": "gen-a-5",
  "source": "authored",
  "domain": 1,
  "topic": "Edge and content delivery design",
  "difficulty": "medium",
  "multi": true,
  "question": "A gaming company hosts two workloads. The first is a large library of static game assets stored in an Amazon S3 bucket that players download over HTTPS from all over the world. The second is a real-time telemetry service that uses a custom UDP protocol and runs behind Network Load Balancers in three Regions. The company needs global performance improvements for both workloads, needs a small set of static IP addresses that can be embedded in the game client for the telemetry service, and must prevent direct public access to the S3 bucket. Which two actions should a network engineer take? (Choose two.)",
  "choices": {
   "A": "Create an Amazon CloudFront distribution with the S3 bucket as the origin, and use origin access control (OAC) with a bucket policy that allows access only from the distribution.",
   "B": "Create an Amazon CloudFront distribution with the Network Load Balancers as custom origins, and enable Origin Shield to accelerate the UDP telemetry traffic.",
   "C": "Create an AWS Global Accelerator standard accelerator with the Network Load Balancers in the three Regions as endpoints, and publish the two static anycast IP addresses to the game client.",
   "D": "Create an AWS Global Accelerator accelerator with the S3 bucket as an endpoint, and disable public access on the bucket.",
   "E": "Place the S3 bucket behind an internet-facing Application Load Balancer, and register the bucket as an IP target group so that requests are proxied privately."
  },
  "answer": [
   "A",
   "C"
  ],
  "explanation": "CloudFront with origin access control is the standard pattern for globally caching S3 content while keeping the bucket private, because the bucket policy can restrict access to the distribution only. Global Accelerator supports both TCP and UDP, provides two static anycast IP addresses that can be hardcoded in a client, and routes traffic to the closest healthy Regional endpoint over the AWS backbone, which fits the telemetry service. Option B is wrong because CloudFront only proxies HTTP and HTTPS and cannot carry a custom UDP protocol. Option D is wrong because Global Accelerator endpoints are Network Load Balancers, Application Load Balancers, EC2 instances, or elastic IP addresses, not S3 buckets. Option E is wrong because an Application Load Balancer cannot target an S3 bucket."
 },
 {
  "id": "gen-a-6",
  "source": "authored",
  "domain": 1,
  "topic": "BGP path selection for hybrid connectivity",
  "difficulty": "hard",
  "multi": false,
  "question": "A company has two AWS Direct Connect private virtual interfaces from two different Direct Connect locations to the same Direct Connect gateway. One connection is intended to be primary and the other is intended to be a standby. AWS advertises the identical set of VPC prefixes over both virtual interfaces, and the company advertises the identical on-premises prefixes over both virtual interfaces. A network engineer must ensure that traffic that originates on premises and is destined for the VPCs uses the primary connection whenever it is available. What should the network engineer do?",
  "choices": {
   "A": "Apply the BGP community 7224:7300 to the prefixes that the company advertises to AWS over the primary virtual interface and 7224:7100 over the standby virtual interface.",
   "B": "Configure a higher BGP local preference on the company edge router for the routes that are received over the primary virtual interface than for the routes that are received over the standby virtual interface.",
   "C": "Prepend the company autonomous system number three times to the prefixes that AWS advertises over the standby virtual interface.",
   "D": "Set a lower BGP multi-exit discriminator (MED) value on the routes that AWS advertises over the primary virtual interface."
  },
  "answer": [
   "B"
  ],
  "explanation": "The direction of traffic that leaves the on-premises network is decided entirely by the on-premises routers, so the engineer must influence the local BGP best path selection there; local preference is evaluated before AS_PATH length and is the standard way to prefer one exit path. Option A influences the opposite direction, because the 7224:7100, 7224:7200, and 7224:7300 communities set the local preference that AWS applies to routes it learns from the customer, which controls AWS to on-premises traffic. Option C is not possible because the customer cannot modify the AS_PATH of prefixes that AWS advertises; prepending is applied to routes that the customer advertises. Option D is also not possible, because MED is set by the advertising side, and MED is evaluated only after local preference and AS_PATH anyway."
 },
 {
  "id": "gen-a-7",
  "source": "authored",
  "domain": 1,
  "topic": "Direct Connect public VIF BGP communities",
  "difficulty": "hard",
  "multi": false,
  "question": "A company uses an AWS Direct Connect public virtual interface to reach AWS public service endpoints. The company advertises its own public prefixes to AWS over the public virtual interface. For compliance reasons, the company wants these prefixes to be reachable only from the AWS Region that is local to the Direct Connect location, and it does not want AWS to advertise the prefixes from other Regions or other continents. Which BGP community should the company apply to the prefixes that it advertises to AWS?",
  "choices": {
   "A": "7224:9100",
   "B": "7224:8100",
   "C": "7224:9300",
   "D": "7224:7100"
  },
  "answer": [
   "A"
  ],
  "explanation": "On a public virtual interface, the customer applies scope communities to the prefixes it advertises to AWS: 7224:9100 limits propagation to the local AWS Region, 7224:9200 limits propagation to the continent, and 7224:9300 propagates globally, which is also the default when no community is applied. Option B is wrong because the 7224:8100, 7224:8200, and no-tag communities are the ones AWS attaches to the routes it advertises to the customer so the customer can filter by scope. Option C would advertise the prefixes globally, which is the opposite of the requirement. Option D is a local preference community that is used on private and transit virtual interfaces to influence AWS path selection, not to scope public prefix advertisement."
 },
 {
  "id": "gen-a-8",
  "source": "authored",
  "domain": 1,
  "topic": "Routing design and longest prefix match",
  "difficulty": "medium",
  "multi": false,
  "question": "A company uses an AWS Direct Connect private virtual interface as its primary path and an AWS Site-to-Site VPN as its backup path. Both terminate on the same virtual private gateway. On premises, the company advertises the summary route 192.168.0.0/16 over Direct Connect and advertises the more specific routes 192.168.10.0/24 and 192.168.20.0/24 over the VPN. Users report that traffic from EC2 instances to 192.168.10.0/24 traverses the VPN even though Direct Connect is available and healthy. What should a network engineer do to make Direct Connect the preferred path for all on-premises destinations while keeping the VPN as backup?",
  "choices": {
   "A": "Advertise the same set of prefixes, including 192.168.10.0/24 and 192.168.20.0/24, over the Direct Connect private virtual interface as are advertised over the VPN.",
   "B": "Add static routes for 192.168.10.0/24 and 192.168.20.0/24 in the VPC subnet route tables that point to the virtual private gateway.",
   "C": "Apply the BGP community 7224:7300 to the prefixes that are advertised over the VPN connection so that AWS assigns them a higher local preference.",
   "D": "Enable BFD on the VPN tunnels so that the virtual private gateway detects the Direct Connect path as more stable."
  },
  "answer": [
   "A"
  ],
  "explanation": "The virtual private gateway evaluates routes by longest prefix match first, so a /24 learned over the VPN always wins over a /16 learned over Direct Connect regardless of the transport type; advertising identical prefixes over both paths allows the built-in preference for Direct Connect over VPN to take effect. Option B does not help because static routes toward a virtual private gateway still resolve to the same gateway and do not select the underlying path, and the more specific propagated VPN route remains in play. Option C is wrong because local preference communities are not supported on Site-to-Site VPN BGP sessions and, even if they were, raising the VPN preference is the opposite of the goal. Option D is wrong because BFD only accelerates failure detection and does not change path preference."
 },
 {
  "id": "gen-a-9",
  "source": "authored",
  "domain": 1,
  "topic": "Multi-account DNS architecture",
  "difficulty": "medium",
  "multi": false,
  "question": "An enterprise runs more than 200 AWS accounts in AWS Organizations, each with one or more VPCs. Every VPC must be able to resolve records in three centrally managed Amazon Route 53 private hosted zones and must use the same set of Route 53 Resolver forwarding rules for on-premises domains. Today a network team runs scripts that create VPC association authorizations and associate each new VPC individually, which has become an operational burden. Which solution will reduce operational overhead the most?",
  "choices": {
   "A": "Create a Route 53 Profile in the networking account, add the private hosted zones and the Resolver rules to the profile, share the profile with the organization by using AWS Resource Access Manager, and associate the profile with the VPCs.",
   "B": "Convert the private hosted zones to public hosted zones and rely on the Amazon provided DNS resolver in each VPC to answer the queries.",
   "C": "Deploy Route 53 Resolver inbound endpoints in every VPC and configure the VPC DHCP option sets to point to those endpoint IP addresses.",
   "D": "Create an AWS CloudFormation StackSet that runs a custom resource in every account to call the CreateVPCAssociationAuthorization and AssociateVPCWithHostedZone APIs whenever a VPC is created."
  },
  "answer": [
   "A"
  ],
  "explanation": "Route 53 Profiles bundle private hosted zones, Resolver rules, and DNS Firewall rule groups into a single object that can be shared across accounts with AWS Resource Access Manager and associated with many VPCs, which eliminates per-VPC authorization and association work. Option B exposes internal DNS records publicly and does not meet enterprise privacy expectations. Option C is wrong because inbound endpoints are for on-premises queries into AWS, they add cost in every VPC, and overriding the DHCP option set breaks resolution of VPC internal names and other AWS service endpoints. Option D still performs the same per-VPC association calls and merely automates the existing burden rather than removing it."
 },
 {
  "id": "gen-a-10",
  "source": "authored",
  "domain": 1,
  "topic": "Direct Connect gateway prefix advertisement",
  "difficulty": "hard",
  "multi": false,
  "question": "A company associates an AWS Transit Gateway with an AWS Direct Connect gateway so that 60 VPCs can be reached from the on-premises data center over a transit virtual interface. When the network engineer tries to configure the association, the engineer cannot add all 60 VPC CIDR blocks to the list of prefixes that are advertised to the on-premises network. Which action will allow all 60 VPCs to be reachable from on premises?",
  "choices": {
   "A": "Request a quota increase for virtual interfaces per Direct Connect connection, and create one transit virtual interface for every 20 VPC CIDR blocks.",
   "B": "Allocate the VPC CIDR blocks from a contiguous address block and configure a small number of summary prefixes on the transit gateway association so that the allowed prefixes list stays within the supported limit.",
   "C": "Enable route propagation from the transit gateway to the Direct Connect gateway so that the VPC CIDR blocks are advertised dynamically instead of being listed statically.",
   "D": "Create a second Direct Connect gateway and associate 40 of the VPC attachments with it by using an additional private virtual interface."
  },
  "answer": [
   "B"
  ],
  "explanation": "A transit gateway association on a Direct Connect gateway supports a limited allowed prefixes list, currently 20 prefixes, and those prefixes are what AWS advertises on premises, so the practical design is to plan contiguous CIDR allocations that can be summarized into a handful of supernets. Option A does not help because the constraint is the allowed prefixes list on the association, not the number of virtual interfaces, and a dedicated connection supports only one transit virtual interface. Option C is wrong because the allowed prefixes list is always statically configured for a transit gateway association; there is no propagation option. Option D is wrong because a private virtual interface cannot be used to reach a transit gateway, and VPC attachments belong to the transit gateway rather than to a Direct Connect gateway."
 },
 {
  "id": "gen-a-11",
  "source": "authored",
  "domain": 1,
  "topic": "AWS Cloud WAN segmentation",
  "difficulty": "hard",
  "multi": true,
  "question": "A global company is replacing a mesh of transit gateways with AWS Cloud WAN. The company must keep production, development, and payment card workloads in separate routing domains across four Regions. Attachments must be placed into the correct routing domain automatically based on account and resource tags without a network engineer manually mapping each VPC. A shared services VPC must be reachable from the production routing domain but the production routing domain must not be reachable from the development routing domain. Which two actions should the network engineer take? (Choose two.)",
  "choices": {
   "A": "Define production, development, and payment segments in the core network policy document, and set the isolate-attachments property so that attachments in the same segment cannot communicate unless explicitly allowed.",
   "B": "Define attachment policy rules in the core network policy that evaluate attachment tags and account conditions, and use the association-method of constant or tag to place each attachment into the correct segment.",
   "C": "Create one core network per segment and peer the core networks together so that each routing domain remains isolated.",
   "D": "Use segment actions of type share in the core network policy to allow the shared services attachment to be reachable from the production segment.",
   "E": "Create a separate transit gateway in each Region, attach it to the Cloud WAN core network, and use transit gateway route tables to implement the segmentation."
  },
  "answer": [
   "B",
   "D"
  ],
  "explanation": "Cloud WAN attachment policies evaluate conditions such as tag key and value, account ID, or Region, and then place the attachment into a segment automatically, which removes manual mapping. Segment actions of type share create the controlled leaking of routes between segments, which is how a shared services attachment is exposed to production without merging the routing domains. Option A is misleading because isolate-attachments prevents communication between attachments within the same segment, which is not what the scenario asks for. Option C is wrong because segments already provide isolation inside one core network and multiple core networks add unnecessary complexity. Option E reintroduces the transit gateway mesh that the company is replacing and does not provide the policy-driven segmentation described."
 },
 {
  "id": "gen-a-12",
  "source": "authored",
  "domain": 1,
  "topic": "IP address management across accounts",
  "difficulty": "easy",
  "multi": false,
  "question": "A company that operates 90 AWS accounts has repeatedly created VPCs with overlapping CIDR blocks, which has blocked transit gateway attachments and Direct Connect advertisements. The company wants a central team to own the address space, wants application teams to request CIDR blocks from a pool without opening tickets, and wants automatic detection of any VPC that is created outside the approved address space. Which solution will meet these requirements?",
  "choices": {
   "A": "Use Amazon VPC IP Address Manager (IPAM) with a top-level pool and Regional pools shared through AWS Resource Access Manager, and allocate VPC CIDR blocks from the pools while monitoring IPAM compliance findings.",
   "B": "Store the approved CIDR blocks in AWS Systems Manager Parameter Store and require every AWS CloudFormation VPC template to read the parameter.",
   "C": "Use AWS Network Manager global networks to allocate CIDR blocks and to raise alarms when a VPC overlaps another VPC.",
   "D": "Create a service control policy that denies the ec2:CreateVpc action unless the request includes a CIDR block that matches an approved condition key value."
  },
  "answer": [
   "A"
  ],
  "explanation": "IPAM is the purpose-built service for hierarchical address planning: a top-level pool can be subdivided into Regional and per-business-unit pools, shared with member accounts through Resource Access Manager, and VPCs can be created by requesting an allocation from a pool instead of hardcoding a CIDR. IPAM also continuously monitors resources and reports overlapping or non-compliant allocations. Option B provides no enforcement or tracking of what has already been consumed. Option C is wrong because Network Manager provides visibility and monitoring of a global network, not address allocation. Option D cannot express arbitrary CIDR range containment reliably and provides no allocation tracking or discovery of resources created before the policy existed."
 },
 {
  "id": "gen-a-13",
  "source": "authored",
  "domain": 1,
  "topic": "Centralized egress and inspection design",
  "difficulty": "hard",
  "multi": false,
  "question": "A company must inspect all traffic between its spoke VPCs, and all internet-bound traffic from those VPCs, by using a fleet of third-party firewall appliances. The appliances are deployed in an inspection VPC across three Availability Zones behind a Gateway Load Balancer, and they perform stateful inspection. All VPCs are attached to a single AWS Transit Gateway. Users report that long-lived TCP sessions between spoke VPCs are dropped intermittently, and packet captures show that the return traffic arrives at a different appliance than the forward traffic. What should a network engineer do?",
  "choices": {
   "A": "Enable appliance mode on the transit gateway VPC attachment for the inspection VPC.",
   "B": "Enable cross-zone load balancing on the Gateway Load Balancer and disable flow stickiness on the target group.",
   "C": "Enable equal-cost multipath (ECMP) on the transit gateway and create one attachment per Availability Zone for the inspection VPC.",
   "D": "Replace the Gateway Load Balancer with a Network Load Balancer that uses a TCP listener and enable client IP preservation."
  },
  "answer": [
   "A"
  ],
  "explanation": "By default a transit gateway keeps traffic in the Availability Zone in which it enters an attachment, which can send the forward and return flows of the same connection through appliances in different Availability Zones and break stateful inspection. Appliance mode on the inspection VPC attachment makes the transit gateway select a single Availability Zone for the lifetime of a flow, so both directions traverse the same appliance. Option B makes the asymmetry worse because cross-zone load balancing spreads traffic across appliances in all Availability Zones, and Gateway Load Balancer flow stickiness is what keeps a flow pinned to one target. Option C is not valid because a VPC can have only one transit gateway attachment per transit gateway, and ECMP applies to VPN and Connect attachments. Option D is wrong because a Network Load Balancer cannot transparently inspect traffic with the GENEVE-based bump-in-the-wire model that the firewalls require."
 },
 {
  "id": "gen-a-14",
  "source": "authored",
  "domain": 1,
  "topic": "Route 53 routing policies",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs an identical web application in the us-west-2 Region and the eu-central-1 Region behind Application Load Balancers. The company wants users to be directed to the geographically closer deployment, but during a planned capacity test the company must be able to gradually shift a defined portion of the traffic that would normally go to eu-central-1 over to us-west-2 without editing client configurations or changing DNS TTLs. Which Amazon Route 53 configuration will meet these requirements?",
  "choices": {
   "A": "Create latency records for both Application Load Balancers and attach health checks that are calculated from Amazon CloudWatch alarms on request count.",
   "B": "Create geolocation records that map continents to each Application Load Balancer and add a default record for unmapped locations.",
   "C": "Create geoproximity records for both Application Load Balancers and adjust the bias value on the eu-central-1 record to expand or shrink its geographic area.",
   "D": "Create weighted records for both Application Load Balancers and use a multivalue answer routing policy as the fallback."
  },
  "answer": [
   "C"
  ],
  "explanation": "Geoproximity routing routes users based on the physical distance between the user and the resource, and its bias parameter expands or shrinks the geographic region that is served by a given endpoint, which is exactly the controlled traffic-shift capability that is described. Option A routes on measured network latency rather than distance and offers no dial to shift a defined portion of traffic. Option B is coarse and rule-based, so shifting a fraction of European users would require repeatedly re-mapping countries. Option D can shift traffic by percentage but ignores user location entirely, so it does not satisfy the primary requirement to send users to the closer deployment."
 },
 {
  "id": "gen-a-15",
  "source": "authored",
  "domain": 1,
  "topic": "CloudFront origin design",
  "difficulty": "medium",
  "multi": false,
  "question": "A company serves a web application from an Application Load Balancer that currently sits in public subnets. Security auditors require that the load balancer no longer have a public IP address and that it not be reachable from the internet except through the company Amazon CloudFront distribution. The company does not want to manage a custom header secret or maintain a list of CloudFront IP ranges in security groups. Which solution will meet these requirements with the least operational overhead?",
  "choices": {
   "A": "Convert the Application Load Balancer to internal, and configure the CloudFront distribution to use a VPC origin that points to the internal Application Load Balancer.",
   "B": "Keep the Application Load Balancer internet facing, and attach a security group that references the com.amazonaws.global.cloudfront.origin-facing managed prefix list.",
   "C": "Convert the Application Load Balancer to internal, and place an AWS Global Accelerator in front of it as the CloudFront origin.",
   "D": "Keep the Application Load Balancer internet facing, and add an origin custom header in CloudFront with an AWS WAF rule on the load balancer that blocks requests without the header."
  },
  "answer": [
   "A"
  ],
  "explanation": "CloudFront VPC origins allow a distribution to send requests directly to an internal Application Load Balancer, Network Load Balancer, or EC2 instance in private subnets, which removes the public IP address entirely and requires no header secrets or prefix list maintenance. Option B leaves the load balancer internet facing with a public IP address, which violates the auditor requirement even though the managed prefix list does narrow the source range. Option C is invalid because Global Accelerator endpoints are not valid CloudFront origins and Global Accelerator would itself be public. Option D is the older custom header pattern that the company explicitly wants to avoid, and it also leaves the load balancer publicly addressable."
 },
 {
  "id": "gen-a-16",
  "source": "authored",
  "domain": 1,
  "topic": "IPv6 VPC design",
  "difficulty": "medium",
  "multi": false,
  "question": "A company is building a new VPC for a containerized workload that has exhausted its private IPv4 space. The company decides to use IPv6-only subnets for the worker nodes. The workers must be able to call an external partner API that is reachable only over IPv4 on the internet, and they must never be reachable from the internet. Which combination of VPC components will meet these requirements?",
  "choices": {
   "A": "An egress-only internet gateway in the route table for the IPv6 default route, plus a NAT gateway for IPv4 traffic.",
   "B": "A NAT gateway with NAT64 enabled, DNS64 enabled on the IPv6-only subnets, and a route for 64:ff9b::/96 that points to the NAT gateway, with the NAT gateway in an IPv4 public subnet.",
   "C": "An internet gateway with a route for ::/0, and security group rules that deny inbound IPv6 traffic from 0.0.0.0/0.",
   "D": "An egress-only internet gateway with DNS64 enabled and a route for 64:ff9b::/96 that points to the egress-only internet gateway."
  },
  "answer": [
   "B"
  ],
  "explanation": "To let IPv6-only workloads reach IPv4-only destinations, you enable DNS64 on the subnet so the Route 53 Resolver synthesizes AAAA records in the well-known 64:ff9b::/96 prefix, and you route that prefix to a NAT gateway, which performs NAT64 translation and then sends IPv4 traffic out through an internet gateway from its public subnet. Option A is incomplete because an IPv6-only instance has no IPv4 address and therefore cannot use a NAT gateway through an IPv4 default route. Option C exposes the workload to inbound IPv6 traffic through the internet gateway and does not solve IPv4 reachability at all. Option D is wrong because an egress-only internet gateway handles only IPv6 to IPv6 traffic and performs no protocol translation."
 },
 {
  "id": "gen-a-17",
  "source": "authored",
  "domain": 1,
  "topic": "DNS resolution across a transit gateway",
  "difficulty": "hard",
  "multi": true,
  "question": "A company operates a hub-and-spoke network with an AWS Transit Gateway. Thirty spoke VPCs in different accounts each host applications that register records in account-specific Amazon Route 53 private hosted zones. On-premises clients that connect over AWS Direct Connect must resolve names in all of those private hosted zones, and instances in the spoke VPCs must resolve on-premises names. The company wants to deploy Route 53 Resolver endpoints only in a central networking VPC. Which two actions should a network engineer take? (Choose two.)",
  "choices": {
   "A": "Associate each spoke private hosted zone with the central networking VPC, create a Route 53 Resolver inbound endpoint in the central VPC, and configure the on-premises DNS servers to forward the relevant domains to the inbound endpoint IP addresses.",
   "B": "Create a Route 53 Resolver outbound endpoint and forwarding rules in the central networking VPC, share the rules with the organization by using AWS Resource Access Manager, and associate the shared rules with each spoke VPC.",
   "C": "Create a Route 53 Resolver inbound endpoint in every spoke VPC and advertise the endpoint IP addresses to on premises over the Direct Connect transit virtual interface.",
   "D": "Configure the DHCP option set of each spoke VPC to use the IP addresses of the inbound endpoint in the central networking VPC as the domain name servers.",
   "E": "Create a Route 53 Profile in each spoke account, and peer the profiles with the central networking account so that Resolver rules propagate through the transit gateway."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Private hosted zones are resolvable through an inbound endpoint only if the zones are associated with the VPC that hosts the endpoint, so associating all spoke zones with the central networking VPC and pointing on-premises conditional forwarders at the inbound endpoint IP addresses solves inbound resolution. For outbound resolution, a single outbound endpoint with forwarding rules can serve every VPC because Resolver rules are shareable with Resource Access Manager and can be associated with many VPCs across accounts. Option C contradicts the requirement to deploy endpoints only in the central VPC and multiplies cost. Option D would break resolution of VPC internal names and public names for the spokes and is unnecessary because rule association already directs the queries. Option E is wrong because Route 53 Profiles are shared through Resource Access Manager and are not peered, and Resolver configuration does not propagate over a transit gateway."
 },
 {
  "id": "gen-a-18",
  "source": "authored",
  "domain": 1,
  "topic": "Route 53 Resolver rule precedence",
  "difficulty": "medium",
  "multi": false,
  "question": "A VPC is associated with a Route 53 private hosted zone for example.internal. The same VPC is also associated with a Route 53 Resolver forwarding rule for example.internal that targets on-premises DNS servers, and with a second forwarding rule for db.example.internal that targets a different set of on-premises DNS servers. An engineer queries app.example.internal from an EC2 instance in the VPC and then queries reports.db.example.internal. Which statement correctly describes how the Route 53 Resolver handles these queries?",
  "choices": {
   "A": "Both queries are answered from the private hosted zone, because private hosted zone records always take precedence over Resolver rules.",
   "B": "The query for app.example.internal is forwarded by the example.internal rule, and the query for reports.db.example.internal is forwarded by the db.example.internal rule, because the Resolver applies the most specific matching rule.",
   "C": "Both queries fail with SERVFAIL, because a domain cannot have both a private hosted zone association and a forwarding rule association in the same VPC.",
   "D": "The query for app.example.internal is forwarded by the example.internal rule, and the query for reports.db.example.internal is answered from the private hosted zone, because subdomains are excluded from forwarding rules."
  },
  "answer": [
   "B"
  ],
  "explanation": "When a VPC has both a private hosted zone and Resolver rules that match a query name, the Resolver selects the most specific match, and a forwarding rule for the same domain takes precedence over the private hosted zone. Because db.example.internal is more specific than example.internal, the second query follows the db rule. Option A is wrong because the forwarding rule wins for the matching domain; the correct way to keep a domain resolving locally is to create a system rule for it. Option C is wrong because the combination is a supported and common configuration. Option D is wrong because a forwarding rule matches the domain and all of its subdomains unless a more specific rule or a system rule overrides it."
 },
 {
  "id": "gen-a-19",
  "source": "authored",
  "domain": 1,
  "topic": "Private access to AWS services from on premises",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must allow on-premises batch servers to upload objects to Amazon S3 in the us-east-1 Region. Security policy states that the traffic must not traverse the public internet, must use private IP addresses end to end, and must be restricted to a single S3 bucket. The company already has an AWS Direct Connect connection with a private virtual interface to a VPC. Which solution will meet these requirements?",
  "choices": {
   "A": "Create a gateway VPC endpoint for Amazon S3 in the VPC, add a route for the S3 managed prefix list to the on-premises router, and attach an endpoint policy that allows access only to the bucket.",
   "B": "Create an interface VPC endpoint for Amazon S3 in the VPC with private DNS disabled, create a Route 53 private hosted zone with an alias record for the S3 Regional endpoint that points to the interface endpoint, associate the zone with the VPC, add a Route 53 Resolver inbound endpoint for the on-premises servers, and attach an endpoint policy that allows access only to the bucket.",
   "C": "Create a public virtual interface on the Direct Connect connection, advertise the on-premises prefixes to AWS, and use a bucket policy with an aws:SourceIp condition that matches the on-premises public addresses.",
   "D": "Create an AWS PrivateLink endpoint service in the VPC that is backed by a Network Load Balancer that targets the S3 Regional endpoint IP addresses, and connect the on-premises servers to it over the private virtual interface."
  },
  "answer": [
   "B"
  ],
  "explanation": "Gateway endpoints are reachable only from within the VPC through route table entries and cannot be used from on premises, so private S3 access from a data center requires an interface endpoint whose elastic network interfaces have private IP addresses reachable over the private virtual interface. Because on-premises resolvers do not use the VPC resolver by default, DNS must be handled explicitly, either with a private hosted zone plus a Resolver inbound endpoint or with on-premises DNS records that point at the endpoint addresses, and the endpoint policy restricts access to the single bucket. Option A fails because on-premises networks cannot use a gateway endpoint. Option C uses public AWS endpoints and public addressing, which violates the private IP requirement even though the traffic stays on the Direct Connect path. Option D is unsupported because you cannot target AWS public service endpoint IP addresses with a Network Load Balancer in a stable, supported way."
 },
 {
  "id": "gen-a-20",
  "source": "authored",
  "domain": 1,
  "topic": "Site-to-Site VPN throughput design",
  "difficulty": "medium",
  "multi": false,
  "question": "A company connects a branch data center to AWS with a single AWS Site-to-Site VPN connection that terminates on an AWS Transit Gateway. A nightly data transfer job needs approximately 4 Gbps of aggregate throughput, but the company observes that throughput never exceeds about 1.25 Gbps. The company wants to increase throughput without provisioning AWS Direct Connect. What should a network engineer do?",
  "choices": {
   "A": "Enable acceleration on the existing VPN connection so that traffic uses AWS Global Accelerator and the AWS backbone.",
   "B": "Create four Site-to-Site VPN connections to the transit gateway that use BGP dynamic routing and advertise the same prefixes, and enable ECMP on the transit gateway.",
   "C": "Increase the MTU on the VPN tunnels to 8500 bytes and enable jumbo frames on the customer gateway device.",
   "D": "Enable both tunnels of the existing VPN connection in an active-active configuration by adding a second static route with the same destination."
  },
  "answer": [
   "B"
  ],
  "explanation": "Each Site-to-Site VPN tunnel is limited to approximately 1.25 Gbps, so aggregate throughput is increased by creating multiple VPN connections that use BGP and enabling equal-cost multipath on the transit gateway, which load balances flows across the tunnels. Option A reduces latency and jitter by moving traffic onto the AWS global network sooner but does not raise the per-tunnel throughput limit. Option C is wrong because a Site-to-Site VPN tunnel supports a maximum MTU of 1446 bytes; the 8500-byte figure applies to other transit gateway attachment types. Option D does not work because ECMP requires dynamic routing across multiple VPN connections, and static routes on a single connection do not aggregate tunnel bandwidth."
 },
 {
  "id": "gen-a-21",
  "source": "authored",
  "domain": 1,
  "topic": "Global Accelerator design",
  "difficulty": "hard",
  "multi": false,
  "question": "A company runs a multiplayer session service on thousands of EC2 instances in private subnets across two Regions. Each game session is assigned to one specific instance and one specific UDP port, and the client must be able to reach that exact instance and port directly. The company needs a small number of static IP addresses for the clients and wants traffic to enter the AWS global network as close to the player as possible. Which solution will meet these requirements?",
  "choices": {
   "A": "Create an AWS Global Accelerator standard accelerator with Network Load Balancer endpoints, and use a UDP listener with client affinity set to source IP.",
   "B": "Create an AWS Global Accelerator custom routing accelerator with VPC subnets as endpoints, and map listener port ranges to the destination instance addresses and ports.",
   "C": "Create an Amazon CloudFront distribution with a Lambda@Edge function that rewrites the request to the correct instance and port.",
   "D": "Assign an elastic IP address to each instance and use Amazon Route 53 multivalue answer records to return the addresses to clients."
  },
  "answer": [
   "B"
  ],
  "explanation": "Custom routing accelerators are designed for exactly this deterministic mapping: they expose static anycast IP addresses and port ranges that map to specific private instance IP addresses and ports inside registered VPC subnets, which lets a client be steered to a single session server. Option A cannot work because a Network Load Balancer distributes new flows across healthy targets and cannot guarantee that a client reaches one predetermined instance and port. Option C is wrong because CloudFront handles only HTTP and HTTPS and cannot forward UDP. Option D defeats the requirement for a small set of static IP addresses, exposes thousands of public addresses, and does not use the AWS global network for ingress optimization."
 },
 {
  "id": "gen-a-22",
  "source": "authored",
  "domain": 1,
  "topic": "Transit Gateway route table design",
  "difficulty": "medium",
  "multi": true,
  "question": "A network engineer is designing a transit gateway route table layout for an organization that has 40 spoke VPCs, one shared services VPC, and one Direct Connect gateway attachment. Spoke VPCs must reach the shared services VPC and the on-premises network, but spoke VPCs must never reach each other. The engineer also needs the ability to quickly stop traffic to a specific decommissioned VPC CIDR block without detaching it. Which two actions should the engineer take? (Choose two.)",
  "choices": {
   "A": "Create a spoke route table that is associated with all spoke attachments and that has propagations only from the shared services attachment and the Direct Connect gateway attachment.",
   "B": "Create a single transit gateway route table, associate every attachment with it, and enable propagation from every attachment, then use network ACLs in each spoke VPC to block traffic between spokes.",
   "C": "Add a blackhole route for the decommissioned VPC CIDR block in the relevant transit gateway route tables.",
   "D": "Disable the default association and propagation settings on the transit gateway, and rely on VPC subnet route tables that omit the other spoke CIDR blocks to prevent spoke-to-spoke traffic.",
   "E": "Create a security group referencing rule on each spoke attachment that denies traffic that is sourced from other spoke attachments."
  },
  "answer": [
   "A",
   "C"
  ],
  "explanation": "Isolation is achieved at the transit gateway by associating all spokes with one route table that receives propagations only from the shared services and Direct Connect gateway attachments, so spoke CIDR blocks never appear in the spoke route table and spoke-to-spoke traffic has no route. A blackhole route is the supported way to drop traffic for a specific prefix without removing the attachment, which fits the decommissioning requirement. Option B relies on per-VPC network ACLs, which is error prone at scale and still installs spoke routes at the transit gateway. Option D is insufficient on its own because a spoke VPC route table typically uses a summary route to the transit gateway, and it also does not address the blackhole requirement. Option E is invalid because transit gateway attachments do not support security groups or cross-attachment security group referencing."
 },
 {
  "id": "gen-a-23",
  "source": "authored",
  "domain": 2,
  "topic": "Direct Connect link aggregation groups",
  "difficulty": "medium",
  "multi": false,
  "question": "A network engineer wants to aggregate two existing 10 Gbps AWS Direct Connect dedicated connections into a single logical 20 Gbps link aggregation group (LAG). One connection terminates at the AWS device dxcon-A in a Direct Connect location and the other terminates at a different AWS device in a second Direct Connect location in the same city. The engineer also wants the LAG to be considered down if fewer than two connections are operational. Which statement about this plan is correct?",
  "choices": {
   "A": "The plan works as designed because a LAG can span two Direct Connect locations as long as both connections have the same bandwidth and LACP is enabled.",
   "B": "The plan fails because all connections in a LAG must terminate on the same AWS device at the same Direct Connect location; the engineer must move one connection or create the LAG at a single location.",
   "C": "The plan works only if the engineer first converts both dedicated connections into hosted connections, because LAG membership requires hosted connections.",
   "D": "The plan fails because the minimum links value cannot be changed after a LAG is created, so the engineer must delete and recreate the LAG to require two operational connections."
  },
  "answer": [
   "B"
  ],
  "explanation": "A LAG bundles connections that all terminate on the same AWS device at the same Direct Connect location and that all use the same port speed; a LAG cannot span Direct Connect locations, so location-level redundancy must be achieved with separate connections and BGP, not with LACP. The minimum links setting is configurable on an existing LAG and controls how many operational connections are required before the LAG is considered up, so option D is incorrect. Option A misstates the location constraint. Option C is backwards, because LAGs are built from dedicated connections and a hosted connection cannot be added to a LAG."
 },
 {
  "id": "gen-a-24",
  "source": "authored",
  "domain": 2,
  "topic": "MACsec on Direct Connect",
  "difficulty": "hard",
  "multi": false,
  "question": "A regulated customer requires Layer 2 encryption on its AWS Direct Connect connectivity. The customer currently uses two 1 Gbps hosted connections from an AWS Direct Connect Partner and wants to enable MACsec. A network engineer must determine what changes are required. What should the network engineer do?",
  "choices": {
   "A": "Enable MACsec on the existing hosted connections and associate a connection key name (CKN) and connectivity association key (CAK) pair with each connection.",
   "B": "Order dedicated connections of 10 Gbps or higher at a MACsec-capable Direct Connect location, associate a CKN and CAK pair with each connection, and set the encryption mode to must_encrypt after the MACsec session is established.",
   "C": "Keep the hosted connections and enable MACsec on the transit virtual interfaces, then set the encryption mode to should_encrypt during the migration.",
   "D": "Keep the hosted connections and enable AWS Site-to-Site VPN over the private virtual interfaces so that IPsec provides the required encryption at Layer 2."
  },
  "answer": [
   "B"
  ],
  "explanation": "MACsec is offered only on dedicated connections at supported port speeds of 10 Gbps and above at MACsec-capable Direct Connect locations, and it is configured at the connection or LAG level with a pre-shared CKN and CAK pair used by the MACsec Key Agreement protocol. Setting the mode to must_encrypt before the keys are working would take the link down, so the recommended order is to establish the secure session and then enforce must_encrypt. Option A is wrong because hosted connections do not support MACsec and 1 Gbps ports are not MACsec capable. Option C is wrong because MACsec is a property of the physical connection, not of a virtual interface. Option D provides Layer 3 encryption with IPsec rather than the Layer 2 MACsec encryption that is required, and it changes the throughput characteristics of the link."
 },
 {
  "id": "gen-a-25",
  "source": "authored",
  "domain": 2,
  "topic": "BGP failover tuning",
  "difficulty": "medium",
  "multi": false,
  "question": "A company uses two AWS Direct Connect connections in an active and backup configuration. During a fiber cut on the primary path, the physical interface stays up because the failure occurs beyond an intermediate optical device, and it takes about 90 seconds before traffic fails over to the backup path. The company must reduce the failover time to under two seconds without changing the BGP topology. What should a network engineer do?",
  "choices": {
   "A": "Configure asynchronous Bidirectional Forwarding Detection (BFD) on the customer gateway device with a liveness detection interval of 300 milliseconds and a multiplier of 3, because AWS enables BFD on its side by default.",
   "B": "Reduce the BGP hold timer to 3 seconds and the keepalive timer to 1 second on the customer gateway device, because AWS accepts any negotiated timer values.",
   "C": "Apply the BGP community 7224:7100 to the routes that are advertised over the backup virtual interface so that AWS withdraws them faster.",
   "D": "Enable graceful restart on both BGP sessions so that the routes are removed from the forwarding table immediately when the primary path fails."
  },
  "answer": [
   "A"
  ],
  "explanation": "The 90-second delay is the default BGP hold time expiring, which happens when a failure is not visible as a link-down event; BFD detects the loss of the forwarding path in well under a second. AWS enables asynchronous BFD on Direct Connect virtual interfaces by default with a 300-millisecond interval and a multiplier of 3, so the customer only needs to enable and match it on the customer gateway device. Option B is incorrect because Direct Connect BGP timers cannot be negotiated below the AWS values, so aggressive timers will not take effect. Option C changes AWS path preference for inbound traffic and has no effect on failure detection speed. Option D is the opposite of what is needed, because graceful restart is designed to keep forwarding during a control plane restart rather than to converge quickly."
 },
 {
  "id": "gen-a-26",
  "source": "authored",
  "domain": 2,
  "topic": "Transit VIF and Direct Connect gateway implementation",
  "difficulty": "medium",
  "multi": true,
  "question": "A network engineer must connect an existing AWS Transit Gateway in the eu-west-1 Region to an on-premises data center over a new 10 Gbps AWS Direct Connect dedicated connection. The transit gateway already has 25 VPC attachments that use CIDR blocks inside 10.64.0.0/12. On-premises routers must learn the AWS routes dynamically through BGP. Which two actions must the engineer perform? (Choose two.)",
  "choices": {
   "A": "Create a transit virtual interface on the dedicated connection and associate it with a Direct Connect gateway.",
   "B": "Create a private virtual interface on the dedicated connection and associate it directly with the transit gateway.",
   "C": "Associate the transit gateway with the Direct Connect gateway, and specify the allowed prefixes that AWS will advertise to the on-premises network, such as 10.64.0.0/12.",
   "D": "Enable route propagation from the Direct Connect gateway into the transit gateway route table by editing the propagation settings on the Direct Connect gateway.",
   "E": "Create an AWS Transit Gateway Connect attachment that uses the transit virtual interface as its transport and establish GRE tunnels to the on-premises routers."
  },
  "answer": [
   "A",
   "C"
  ],
  "explanation": "Connecting a transit gateway to Direct Connect requires a transit virtual interface that is associated with a Direct Connect gateway, and then an association between the Direct Connect gateway and the transit gateway that carries the list of allowed prefixes advertised toward on premises. Option B is invalid because a private virtual interface can attach only to a virtual private gateway or Direct Connect gateway that is associated with virtual private gateways, never to a transit gateway. Option D describes settings in the wrong place: propagation of learned on-premises routes is enabled on the transit gateway route table for the Direct Connect gateway attachment, not on the Direct Connect gateway itself. Option E is optional and is used to reach third-party appliances over GRE with BGP; it is not required for basic transit VIF connectivity."
 },
 {
  "id": "gen-a-27",
  "source": "authored",
  "domain": 2,
  "topic": "Transit Gateway attachment configuration",
  "difficulty": "medium",
  "multi": false,
  "question": "A network engineer creates a transit gateway VPC attachment for a VPC that has subnets in three Availability Zones, but selects only one subnet when creating the attachment. Instances in the two Availability Zones without a selected subnet cannot reach other VPCs, even though the subnet route tables contain a route to the transit gateway. What should the engineer do to fix the problem while following AWS best practices?",
  "choices": {
   "A": "Modify the transit gateway attachment to add one subnet in each of the remaining Availability Zones so that a transit gateway elastic network interface exists in every Availability Zone that has workloads.",
   "B": "Create two additional transit gateway attachments for the same VPC, one for each remaining Availability Zone.",
   "C": "Enable appliance mode on the attachment so that traffic from all Availability Zones is directed to the single attachment subnet.",
   "D": "Add routes in the transit gateway route table for the subnet CIDR blocks in the remaining Availability Zones, pointing to the VPC attachment."
  },
  "answer": [
   "A"
  ],
  "explanation": "A transit gateway places an elastic network interface in each subnet that is selected on the VPC attachment, and traffic from an Availability Zone can enter the transit gateway only if that Availability Zone has an attachment network interface. Modifying the attachment to include a subnet in each Availability Zone that hosts workloads resolves the issue and is the documented best practice. Option B is invalid because a VPC can have only one attachment to a given transit gateway. Option C is unrelated, because appliance mode controls flow symmetry for stateful appliances rather than creating reachability across Availability Zones. Option D does not help, because the transit gateway route table controls traffic toward the VPC, not the ability of instances in an Availability Zone without an attachment interface to send traffic into the transit gateway."
 },
 {
  "id": "gen-a-28",
  "source": "authored",
  "domain": 2,
  "topic": "Transit Gateway associations and propagations",
  "difficulty": "medium",
  "multi": false,
  "question": "An engineer creates a transit gateway with default route table association and default route table propagation enabled. The engineer then attaches a security inspection VPC and 12 application VPCs. The engineer creates a second route table named inspection-rt and adds propagations from the application VPC attachments into it, but traffic from application VPCs is still not being sent to the inspection VPC. Which action will most likely resolve the problem?",
  "choices": {
   "A": "Associate the application VPC attachments with a route table whose default route of 0.0.0.0/0 points to the inspection VPC attachment, instead of leaving them associated with the default route table.",
   "B": "Enable propagation from the inspection VPC attachment into the default transit gateway route table.",
   "C": "Add a static route of 0.0.0.0/0 in inspection-rt that points to each application VPC attachment.",
   "D": "Disable default route table propagation on the transit gateway so that the propagations in inspection-rt take effect."
  },
  "answer": [
   "A"
  ],
  "explanation": "The association of an attachment determines which route table is used to look up traffic that enters the transit gateway from that attachment, while propagation only determines which routes are installed into a route table. Because the application attachments are still associated with the default route table, their traffic is evaluated there and never sees the inspection default route, so the fix is to associate them with a route table that steers 0.0.0.0/0 to the inspection attachment. Option B installs the inspection VPC CIDR into the default route table but does not redirect application traffic through the appliance. Option C is backwards, because a default route in the inspection route table should point toward the egress or inspection path, not toward the spokes. Option D changes only future propagation behavior and does not alter the existing association."
 },
 {
  "id": "gen-a-29",
  "source": "authored",
  "domain": 2,
  "topic": "AWS PrivateLink cross-Region access",
  "difficulty": "medium",
  "multi": false,
  "question": "A software company exposes an internal API as an AWS PrivateLink endpoint service that is backed by a Network Load Balancer in the us-east-1 Region. A customer needs to consume the API privately from a VPC in the ap-southeast-2 Region. The customer does not want to build inter-Region transit gateway peering, and the software company does not want to replicate the service into another Region. Which solution will meet these requirements?",
  "choices": {
   "A": "The customer creates an interface VPC endpoint in ap-southeast-2 that specifies the service in us-east-1 as a cross-Region endpoint, and the service provider enables cross-Region access on the endpoint service and allows the customer principal.",
   "B": "The customer creates a Gateway Load Balancer endpoint in ap-southeast-2 and points it to the Network Load Balancer in us-east-1 by using a GENEVE tunnel.",
   "C": "The customer creates an inter-Region VPC peering connection to the provider VPC and adds the Network Load Balancer private IP addresses to its route tables.",
   "D": "The provider publishes the endpoint service in AWS Marketplace, and the customer creates a gateway VPC endpoint in ap-southeast-2 that references the service name."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS PrivateLink supports cross-Region endpoint connections, where a consumer creates an interface endpoint in its Region that targets a service in a different Region while the provider must enable supported Regions on the endpoint service and allow the consumer principal; no peering or transit gateway is required and traffic stays on the AWS network. Option B is wrong because Gateway Load Balancer endpoints are for traffic inspection with GENEVE and cannot front an interface endpoint service. Option C requires the provider to expose its VPC and does not give the consumer a private endpoint or preserve the PrivateLink access model. Option D is wrong because gateway endpoints exist only for Amazon S3 and Amazon DynamoDB and cannot be used with a custom endpoint service."
 },
 {
  "id": "gen-a-30",
  "source": "authored",
  "domain": 2,
  "topic": "VPC endpoint policies and prefix lists",
  "difficulty": "medium",
  "multi": false,
  "question": "A company uses a gateway VPC endpoint for Amazon S3 in a data processing VPC. Security requires that instances in the VPC be able to reach only two approved buckets through the endpoint, and that the security groups on the instances allow outbound traffic to Amazon S3 without allowing outbound traffic to 0.0.0.0/0. Which combination of configuration items will meet these requirements?",
  "choices": {
   "A": "Attach an endpoint policy to the gateway endpoint that allows s3:GetObject and s3:PutObject only on the two bucket ARNs and their object ARNs, and reference the AWS managed prefix list for Amazon S3 in the outbound security group rule.",
   "B": "Attach a bucket policy with an aws:SourceVpce condition to all buckets in the account, and add an outbound security group rule that allows traffic to the CIDR block of the VPC.",
   "C": "Attach an endpoint policy that allows all S3 actions, and add a network ACL rule that denies outbound traffic to every S3 IP range except the two buckets.",
   "D": "Create an interface endpoint for Amazon S3 with private DNS enabled, and add an outbound security group rule that allows HTTPS to the elastic network interface addresses of the endpoint."
  },
  "answer": [
   "A"
  ],
  "explanation": "An endpoint policy on the gateway endpoint restricts which buckets and actions are reachable through that endpoint, and security groups can reference the AWS managed prefix list for Amazon S3 so that outbound rules stay scoped to the service without allowing all destinations. Option B controls access at the bucket rather than at the endpoint, cannot cover buckets in other accounts, and a VPC CIDR based egress rule does not permit traffic to S3 addresses. Option C is impractical because bucket-level distinctions are not expressible in a network ACL, which is IP and port based. Option D changes the architecture unnecessarily and still does not limit which buckets are accessible; it also introduces per-hour and per-GB endpoint charges that a gateway endpoint avoids."
 },
 {
  "id": "gen-a-31",
  "source": "authored",
  "domain": 2,
  "topic": "Gateway Load Balancer implementation",
  "difficulty": "hard",
  "multi": true,
  "question": "A network engineer must inspect all traffic that enters a public-facing VPC from the internet by using third-party appliances that are deployed behind a Gateway Load Balancer in a separate inspection VPC. The Application Load Balancer for the workload lives in public subnets of the public-facing VPC. Which two implementation steps are required? (Choose two.)",
  "choices": {
   "A": "Create Gateway Load Balancer endpoints in dedicated subnets of the public-facing VPC, and update the public subnet route tables so that the default route for return traffic points to the Gateway Load Balancer endpoint.",
   "B": "Create an edge association on the internet gateway with a route table that sends traffic destined for the public subnet CIDR blocks to the Gateway Load Balancer endpoint.",
   "C": "Register the appliances in a Gateway Load Balancer target group that uses the GENEVE protocol on port 6081 and health checks over TCP.",
   "D": "Configure the Application Load Balancer listener to forward traffic to the Gateway Load Balancer as a target of type alb.",
   "E": "Create a transit gateway Connect attachment between the public-facing VPC and the inspection VPC so that GENEVE traffic can be encapsulated across VPCs."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "The distributed inspection pattern requires Gateway Load Balancer endpoints in the public-facing VPC and two routing changes: an ingress route table associated with the internet gateway edge that sends inbound traffic destined for the public subnets to the endpoint, and public subnet route tables that send the return path back through the endpoint so that flows are symmetric. Option C is a distractor that mixes concepts: the Gateway Load Balancer target group does use GENEVE on port 6081, but that target group is created in the inspection VPC by the appliance owner and is not one of the routing steps that makes this ingress design work, and health checks are configured separately from the listener protocol. Option D is invalid because an Application Load Balancer cannot forward to a Gateway Load Balancer. Option E is invalid because Transit Gateway Connect provides GRE-based connectivity to SD-WAN appliances and is unrelated to Gateway Load Balancer endpoints."
 },
 {
  "id": "gen-a-32",
  "source": "authored",
  "domain": 2,
  "topic": "Load balancer implementation with hybrid targets",
  "difficulty": "medium",
  "multi": false,
  "question": "During a phased migration, a company must place an internet-facing Application Load Balancer in front of an application whose servers currently run in an on-premises data center that is connected to AWS with AWS Direct Connect. As servers are migrated, EC2 instances must be added to the same load balancer so that both environments receive traffic. Which implementation will meet these requirements?",
  "choices": {
   "A": "Create a target group of type ip, register the private RFC 1918 addresses of the on-premises servers and the private addresses of the EC2 instances, and make sure that the load balancer subnets can route to the on-premises prefixes over the Direct Connect path.",
   "B": "Create a target group of type instance, and register the on-premises servers by using the AWS Systems Manager hybrid activation instance IDs.",
   "C": "Create a Network Load Balancer with a target group of type alb, and register the on-premises servers as a second Application Load Balancer target.",
   "D": "Create a target group of type lambda that invokes a function which proxies each request to the on-premises servers over the Direct Connect connection."
  },
  "answer": [
   "A"
  ],
  "explanation": "An Application Load Balancer supports IP address targets, and those targets can be on-premises addresses in the RFC 1918 ranges that are reachable over Direct Connect or VPN, which allows a single load balancer to front both environments during a migration. Option B is wrong because instance type target groups accept only EC2 instance IDs in the same VPC and Systems Manager managed instance IDs are not valid load balancer targets. Option C is wrong because the alb target type applies to a Network Load Balancer registering an Application Load Balancer in the same VPC and cannot register on-premises servers. Option D adds significant latency and complexity, changes request semantics, and is not a sound design for a straight migration cutover."
 },
 {
  "id": "gen-a-33",
  "source": "authored",
  "domain": 2,
  "topic": "Network Load Balancer and PrivateLink client IP",
  "difficulty": "hard",
  "multi": false,
  "question": "A SaaS provider exposes an application through an AWS PrivateLink endpoint service that is backed by a Network Load Balancer with a TCP listener. The application team reports that all requests appear to come from a small set of private addresses inside the provider VPC, so per-consumer logging is impossible. The provider must identify which consumer VPC endpoint each connection came from without modifying the network path. What should a network engineer do?",
  "choices": {
   "A": "Enable client IP preservation on the Network Load Balancer target group so that the original consumer instance IP address is passed to the targets.",
   "B": "Enable Proxy Protocol version 2 on the target group and update the application to read the VPC endpoint ID from the custom TLV field in the Proxy Protocol header.",
   "C": "Replace the TCP listener with a TLS listener and read the X-Forwarded-For header that the Network Load Balancer inserts.",
   "D": "Enable Network Load Balancer access logs and correlate the source IP addresses with the endpoint service allowlist of consumer principals."
  },
  "answer": [
   "B"
  ],
  "explanation": "Traffic that arrives through a PrivateLink interface endpoint is source NATted by the service, so the consumer client IP address is never available; instead, AWS inserts the endpoint ID in a custom type-length-value field of the Proxy Protocol version 2 header, which the application can parse to identify the consumer. Option A does not help because client IP preservation is not supported for traffic that arrives through a VPC endpoint service. Option C is wrong because a Network Load Balancer operates at Layer 4 and never inserts HTTP headers such as X-Forwarded-For, even with a TLS listener. Option D is insufficient because access logs are produced only for TLS listeners and would still record the same NATted addresses rather than the consumer endpoint identity."
 },
 {
  "id": "gen-a-34",
  "source": "authored",
  "domain": 2,
  "topic": "Infrastructure as code for networking",
  "difficulty": "medium",
  "multi": false,
  "question": "A network engineer writes an AWS CloudFormation template that creates an AWS::EC2::TransitGatewayVpcAttachment resource and several AWS::EC2::Route resources that set TransitGatewayId as the target for the 10.0.0.0/8 prefix in the VPC subnet route tables. The stack fails intermittently with an error stating that the route table has no route to the transit gateway or that the transit gateway is not available. Which change will make the deployment reliable?",
  "choices": {
   "A": "Add a DependsOn attribute on each AWS::EC2::Route resource that references the AWS::EC2::TransitGatewayVpcAttachment logical ID.",
   "B": "Move the route resources into a nested stack and use Fn::ImportValue to reference the transit gateway ID from the parent stack.",
   "C": "Replace the AWS::EC2::Route resources with an AWS::EC2::TransitGatewayRoute resource for each subnet route table.",
   "D": "Set the DeletionPolicy attribute to Retain on the transit gateway attachment so that CloudFormation does not remove it during rollback."
  },
  "answer": [
   "A"
  ],
  "explanation": "The route resources reference the transit gateway ID, which is a parameter or a pre-existing value, so CloudFormation sees no dependency on the attachment and can create the routes before the attachment reaches the available state, which causes the intermittent failure. An explicit DependsOn attribute forces CloudFormation to wait for the attachment before creating each route. Option B does not create ordering, because the exported transit gateway ID exists regardless of attachment state, and cross-stack exports cannot be created and imported in the same deployment anyway. Option C is wrong because AWS::EC2::TransitGatewayRoute creates entries in a transit gateway route table, not in a VPC subnet route table. Option D affects deletion behavior and has no impact on creation ordering."
 },
 {
  "id": "gen-a-35",
  "source": "authored",
  "domain": 2,
  "topic": "PrivateLink endpoint service implementation",
  "difficulty": "medium",
  "multi": true,
  "question": "A company must expose an internal HTTPS microservice to three partner AWS accounts privately, without VPC peering and without exposing the service to the internet. The microservice runs on EC2 instances in private subnets across two Availability Zones in the provider VPC. Partners must connect using their own private IP address space and must be able to use the DNS name provider.internal.example.com. Which three implementation steps are required? (Choose three.)",
  "choices": {
   "A": "Create an internal Network Load Balancer in the provider VPC with a TCP or TLS listener and a target group that contains the microservice instances in both Availability Zones.",
   "B": "Create a VPC endpoint service that is associated with the Network Load Balancer, and add the three partner account principal ARNs to the allowed principals list.",
   "C": "Have each partner create an interface VPC endpoint for the endpoint service in their own VPC, and create a Route 53 private hosted zone for provider.internal.example.com with an alias record that points to the endpoint DNS name.",
   "D": "Create an internet-facing Application Load Balancer in the provider VPC and associate it with the endpoint service so that HTTPS host headers can be routed.",
   "E": "Create a gateway VPC endpoint in each partner VPC that references the endpoint service name, and add a route for the provider VPC CIDR block to the partner subnet route tables.",
   "F": "Create a transit gateway attachment in each partner VPC that points at the provider VPC and enable appliance mode on the provider attachment."
  },
  "answer": [
   "A",
   "B",
   "C"
  ],
  "explanation": "An endpoint service is fronted by a Network Load Balancer or a Gateway Load Balancer, so the provider first builds an internal Network Load Balancer across the relevant Availability Zones, then creates the endpoint service and allowlists the partner account principals so their connection requests can be accepted. Each partner then creates an interface endpoint, which gives them elastic network interfaces with private IP addresses in their own address space, and a private hosted zone with an alias to the endpoint DNS name provides the desired custom name. Option D is wrong because an Application Load Balancer cannot back an endpoint service directly, and an internet-facing load balancer contradicts the private requirement. Option E is wrong because gateway endpoints exist only for Amazon S3 and DynamoDB. Option F reintroduces routed connectivity between the VPCs, which the company explicitly wants to avoid."
 },
 {
  "id": "gen-a-36",
  "source": "authored",
  "domain": 2,
  "topic": "Route 53 Resolver DNS Firewall",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team requires that EC2 instances in 15 VPCs be prevented from resolving names in a list of known malicious domains, that queries for a set of newly observed domains be logged but still answered, and that all other resolution continue to work. The team wants a managed solution that does not require agents on the instances. What should a network engineer implement?",
  "choices": {
   "A": "Create a Route 53 Resolver DNS Firewall rule group with a BLOCK rule for the malicious domain list and an ALERT rule for the newly observed domain list, order the rules by priority, and associate the rule group with each VPC.",
   "B": "Create a Route 53 Resolver outbound endpoint and forwarding rules that send the malicious domains to a null-routed DNS server, and enable Resolver query logging for the other domains.",
   "C": "Create AWS Network Firewall stateful rules that match DNS query names and use a drop action for the malicious domains and an alert action for the newly observed domains, then route all VPC traffic through the firewall endpoints.",
   "D": "Create a Route 53 private hosted zone for each malicious domain with no records, and enable Amazon GuardDuty DNS logging to capture the newly observed domains."
  },
  "answer": [
   "A"
  ],
  "explanation": "Route 53 Resolver DNS Firewall is the managed, agentless control for filtering outbound DNS queries from a VPC; it evaluates domain lists in priority order and supports ALLOW, ALERT, and BLOCK actions, and rule groups are associated with VPCs. Option B is a workaround that is fragile, adds endpoint cost, and does not produce the alert-and-answer behavior. Option C would require all DNS traffic to be steered through Network Firewall endpoints and is far more complex than the purpose-built DNS Firewall, although Network Firewall can inspect DNS. Option D partially blocks resolution but returns NXDOMAIN or empty answers only for the exact zone names, does not cover subdomains cleanly, and GuardDuty alone provides detection rather than the required logging and alerting policy."
 },
 {
  "id": "gen-a-37",
  "source": "authored",
  "domain": 2,
  "topic": "Transit Gateway Connect",
  "difficulty": "hard",
  "multi": false,
  "question": "A company deploys a pair of third-party SD-WAN virtual appliances on EC2 instances in a network services VPC that is attached to an AWS Transit Gateway. The company needs the appliances to exchange routes dynamically with the transit gateway instead of relying on static routes, and it wants higher throughput than a single IPsec VPN attachment can provide. Which implementation will meet these requirements?",
  "choices": {
   "A": "Create a Transit Gateway Connect attachment that uses the existing VPC attachment as its transport, create Connect peers with GRE tunnels to the appliance addresses, and establish BGP sessions over the tunnels.",
   "B": "Create two Site-to-Site VPN attachments on the transit gateway that terminate on the appliances and enable acceleration on both VPN connections.",
   "C": "Create a Transit Gateway Connect attachment that uses a Direct Connect gateway as its transport, and peer BGP with the appliances over the private virtual interface.",
   "D": "Create a Gateway Load Balancer in front of the appliances, register it as a transit gateway attachment, and enable route propagation from the Gateway Load Balancer attachment."
  },
  "answer": [
   "A"
  ],
  "explanation": "Transit Gateway Connect provides GRE tunnels and BGP peering to appliances, uses an existing VPC attachment or a Direct Connect transit VIF attachment as transport, avoids the IPsec per-tunnel throughput ceiling, and supports multiple Connect peers with ECMP. Option B keeps the IPsec bandwidth constraint and acceleration reduces latency rather than raising per-tunnel throughput. Option C is wrong in this scenario because the appliances live in a VPC, so the transport must be the VPC attachment; a Direct Connect gateway is not a Connect transport and the appliances are not on premises. Option D is invalid because a Gateway Load Balancer cannot be registered as a transit gateway attachment and does not participate in BGP."
 },
 {
  "id": "gen-a-38",
  "source": "authored",
  "domain": 2,
  "topic": "Site-to-Site VPN implementation options",
  "difficulty": "medium",
  "multi": false,
  "question": "A company has branch offices in Asia that connect to an AWS Transit Gateway in the eu-west-1 Region over AWS Site-to-Site VPN. Users complain about high and variable latency and packet loss over the public internet path. The company cannot deploy AWS Direct Connect at these branches within the project timeline. Which implementation will improve the network performance with the least effort?",
  "choices": {
   "A": "Enable acceleration when creating new Site-to-Site VPN connections on the transit gateway so that the tunnels use AWS Global Accelerator anycast IP addresses and the AWS global network.",
   "B": "Enable acceleration on the existing Site-to-Site VPN connections that terminate on the virtual private gateway.",
   "C": "Change the tunnel inside CIDR blocks to a larger range and increase the MTU to 9001 bytes on the customer gateway devices.",
   "D": "Create a Client VPN endpoint in eu-west-1 and have branch users connect individually through the AWS Client VPN software client."
  },
  "answer": [
   "A"
  ],
  "explanation": "Accelerated Site-to-Site VPN uses AWS Global Accelerator so that tunnel traffic enters the AWS global network at a nearby edge location, which reduces jitter and packet loss for long-haul internet paths; acceleration is supported only on VPN connections that terminate on a transit gateway and must be selected when the connection is created. Option B is invalid because virtual private gateway VPN connections cannot be accelerated and acceleration cannot be toggled on an existing connection. Option C is wrong because the maximum MTU for a Site-to-Site VPN tunnel is 1446 bytes and tunnel inside CIDR sizing does not affect performance. Option D changes the connectivity model to per-user remote access, does not provide site-to-site routing, and does not address the underlying internet path quality."
 },
 {
  "id": "gen-a-39",
  "source": "authored",
  "domain": 2,
  "topic": "MTU and jumbo frames across attachments",
  "difficulty": "hard",
  "multi": false,
  "question": "A data analytics application uses 9001-byte jumbo frames between EC2 instances inside a single VPC and performs well. After the company attaches the VPC to an AWS Transit Gateway and begins copying data to instances in a second VPC that is attached to the same transit gateway, large transfers stall while small packets succeed. The application uses TCP. What should a network engineer do to resolve the problem?",
  "choices": {
   "A": "Set the interface MTU on the instances that communicate across the transit gateway to 8500 bytes, or make sure that path MTU discovery works by allowing inbound ICMP destination unreachable with fragmentation needed messages.",
   "B": "Enable jumbo frame support on the transit gateway attachments so that the transit gateway accepts 9001-byte frames.",
   "C": "Replace the transit gateway connectivity with a VPC peering connection, which supports 9001-byte jumbo frames between VPCs.",
   "D": "Enable appliance mode on both VPC attachments so that the transit gateway reassembles fragmented packets before forwarding them."
  },
  "answer": [
   "A"
  ],
  "explanation": "A transit gateway supports an MTU of 8500 bytes for VPC, Direct Connect, Connect, and peering attachments, and it drops oversized packets that have the do-not-fragment bit set without always producing usable feedback, so the practical fixes are to lower the MTU on the flows that cross the transit gateway or to make sure that ICMP fragmentation needed messages are permitted so path MTU discovery can lower the TCP maximum segment size. Option B is wrong because there is no per-attachment jumbo frame setting; 8500 bytes is the platform limit. Option C is a valid statement about VPC peering supporting 9001 bytes, but redesigning the topology is not necessary and does not scale for a hub-and-spoke network. Option D is unrelated, because appliance mode controls Availability Zone affinity for stateful flows and does not perform reassembly."
 },
 {
  "id": "gen-a-40",
  "source": "authored",
  "domain": 2,
  "topic": "Network automation across accounts",
  "difficulty": "medium",
  "multi": true,
  "question": "A platform team must automate the onboarding of new AWS accounts into a shared hub-and-spoke network. When a new account is created in an organizational unit, a VPC must be deployed with standard subnets and the VPC must be attached to the central AWS Transit Gateway that lives in a networking account. The team wants the process to run without a network engineer logging in to the new account. Which two actions should the team take? (Choose two.)",
  "choices": {
   "A": "Share the transit gateway from the networking account with the organizational unit by using AWS Resource Access Manager, with sharing within AWS Organizations enabled.",
   "B": "Use AWS CloudFormation StackSets with service-managed permissions and automatic deployment enabled for the organizational unit, so that the VPC and the transit gateway attachment are created in each new account.",
   "C": "Create a cross-account IAM role in the networking account and have each new account assume it to create the VPC attachment from the networking account.",
   "D": "Create a transit gateway peering attachment from a local transit gateway in each new account to the central transit gateway, and propagate the routes automatically.",
   "E": "Copy the transit gateway ID into an AWS Systems Manager public parameter so that the new accounts can discover it without a resource share."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A transit gateway can be shared across accounts with AWS Resource Access Manager, and when sharing with AWS Organizations is enabled the share can target an organizational unit so newly created accounts inherit access automatically. CloudFormation StackSets with service-managed permissions and automatic deployment then creates the VPC and the transit gateway attachment in each new account without manual intervention. Option C inverts the model, because the attachment must be created in the account that owns the VPC after the transit gateway is shared with it. Option D is far more expensive and complex, and it also requires static routes because peering attachments do not support propagation. Option E only shares an identifier and does not grant the permission required to create an attachment on a transit gateway owned by another account."
 },
 {
  "id": "gen-b-1",
  "source": "authored",
  "domain": 3,
  "topic": "VPC Flow Logs",
  "difficulty": "medium",
  "multi": false,
  "question": "A company runs a three-tier application in a VPC. Security engineers report that some TCP connections from the web tier to the application tier are being dropped intermittently. The team enables VPC Flow Logs in the default format on the application tier subnet and publishes the logs to Amazon CloudWatch Logs. When the team reviews the records, it can see ACCEPT and REJECT actions, but the engineers cannot determine whether the packets were dropped by a security group or by a network ACL, and they cannot tell which TCP flags were present on the dropped packets. The team must obtain this information with the least operational effort.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Delete the existing flow log and create a new flow log that uses a custom format that includes the tcp-flags, flow-direction, and traffic-path fields. Analyze the new records in CloudWatch Logs Insights.",
   "B": "Enable Traffic Mirroring on the application tier elastic network interfaces and send the mirrored traffic to a network load balancer that fronts packet capture appliances. Inspect the captured packets.",
   "C": "Change the flow log aggregation interval from 10 minutes to 1 minute and add the pkt-srcaddr and pkt-dstaddr fields to the existing flow log definition.",
   "D": "Enable AWS CloudTrail data events for Amazon EC2 network interfaces and correlate the API events with the existing VPC Flow Logs records."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC Flow Logs support a custom format, and the tcp-flags field records the TCP flags observed during the aggregation interval (SYN, SYN-ACK, FIN, RST), which lets the team distinguish a stateless NACL drop of a return packet from a stateful security group drop of the initial SYN. Because flow log format cannot be modified on an existing flow log, the team must create a new flow log with the desired fields; this is the lowest-effort option. Traffic Mirroring would yield full packets but requires deploying and operating capture appliances, which is far more effort and cost. Changing the aggregation interval or adding pkt-srcaddr/pkt-dstaddr does not expose TCP flags, and those fields relate to the original packet source behind intermediate devices. CloudTrail records control-plane API calls, not data-plane packet drops, so it cannot identify the dropping construct."
 },
 {
  "id": "gen-b-2",
  "source": "authored",
  "domain": 3,
  "topic": "Security groups vs NACLs troubleshooting",
  "difficulty": "medium",
  "multi": false,
  "question": "An administrator launches an EC2 instance in a public subnet. The instance security group allows inbound TCP port 443 from 0.0.0.0/0 and has no outbound rules other than the default allow-all rule. The subnet network ACL has an inbound rule that allows TCP port 443 from 0.0.0.0/0 and an outbound rule that allows only TCP ports 80 and 443 to 0.0.0.0/0. Users report that HTTPS connections to the instance time out.\n\nWhat is the MOST likely cause of the issue?",
  "choices": {
   "A": "The security group is stateless, so a matching outbound rule for TCP port 443 must be added explicitly.",
   "B": "The network ACL is stateless, and the outbound rules do not allow the ephemeral port range that the return traffic uses.",
   "C": "The instance is missing an inbound network ACL rule for the ephemeral port range, which blocks the client SYN packet.",
   "D": "The network ACL outbound rule for TCP port 443 has a higher rule number than the default deny rule, so it is never evaluated."
  },
  "answer": [
   "B"
  ],
  "explanation": "Network ACLs are stateless, so response traffic must be explicitly allowed by an outbound rule. An HTTPS server responds from source port 443 to the client's ephemeral port, but the outbound ACL rule set only permits destination ports 80 and 443, so the SYN-ACK is dropped and the client times out. Security groups are stateful, so no outbound rule is required for return traffic, which rules out option A. The client SYN arrives with destination port 443, which the inbound ACL rule already permits, so an inbound ephemeral-range rule is not needed for the initial packet, making option C incorrect. The implicit deny in a network ACL is the asterisk rule that is always evaluated last regardless of numbering, so option D describes behavior that cannot occur."
 },
 {
  "id": "gen-b-3",
  "source": "authored",
  "domain": 3,
  "topic": "Direct Connect BGP troubleshooting",
  "difficulty": "hard",
  "multi": false,
  "question": "A company has two AWS Direct Connect connections at two different Direct Connect locations, each with a private virtual interface to the same virtual private gateway. The company advertises 10.0.0.0/16 over both virtual interfaces and wants connection A to be the primary path for traffic from AWS to on premises. Traffic from AWS is currently using connection B. Both BGP sessions are established, both virtual interfaces are in the available state, and the local preference community tag is not set on either virtual interface.\n\nWhich action will make connection A the preferred path for traffic leaving AWS?",
  "choices": {
   "A": "Apply the 7224:7100 BGP community to the routes advertised over connection A and the 7224:7300 community to the routes advertised over connection B.",
   "B": "Apply the 7224:7300 BGP community to the routes advertised over connection A and leave connection B at the default local preference.",
   "C": "Prepend the on-premises AS number three times to the routes advertised over connection A and advertise a more specific 10.0.0.0/17 prefix over connection B.",
   "D": "Set the MED value to 50 on connection A and 200 on connection B, and enable BGP multipath on the virtual private gateway."
  },
  "answer": [
   "B"
  ],
  "explanation": "For traffic leaving AWS toward on premises, AWS evaluates longest prefix match first, then local preference communities that the customer tags on inbound advertisements. The scoped local preference communities are 7224:7100 (low), 7224:7200 (medium, the default), and 7224:7300 (high), so tagging connection A with 7224:7300 raises its preference above the default medium on connection B. Option A inverts the values, tagging the intended primary with the low preference. AS path prepending is evaluated only after local preference, and advertising a more specific prefix on connection B would actively pull traffic to B because longest prefix match wins, so option C is wrong on both counts. MED is not honored for this purpose in the Direct Connect route selection order and there is no BGP multipath setting on a virtual private gateway, so option D is not valid."
 },
 {
  "id": "gen-b-4",
  "source": "authored",
  "domain": 3,
  "topic": "Reachability Analyzer",
  "difficulty": "easy",
  "multi": false,
  "question": "A network engineer cannot connect from an EC2 instance in VPC A to an Amazon RDS database in VPC B. The VPCs are connected through AWS Transit Gateway. The engineer needs to identify the specific configuration component that is blocking the path without generating any live traffic and without installing agents on the instance.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Use VPC Reachability Analyzer to create and run a path analysis between the instance elastic network interface and the RDS network interface.",
   "B": "Enable VPC Flow Logs on both VPCs, run a connection test from the instance, and search for REJECT records in CloudWatch Logs Insights.",
   "C": "Configure Traffic Mirroring from the instance elastic network interface to a monitoring appliance and inspect the mirrored session.",
   "D": "Use AWS Network Access Analyzer with a scope that includes both VPCs to identify the blocked path."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC Reachability Analyzer performs static configuration analysis of the network path between a source and destination, including across Transit Gateway attachments, and when a path is not reachable it names the blocking component such as a specific security group, network ACL entry, or missing route. Because the analysis is purely configuration based, it sends no packets and requires no agents. VPC Flow Logs and Traffic Mirroring both require live traffic to produce any data, which violates the stated requirement. Network Access Analyzer evaluates unintended network access against scopes for governance purposes; it identifies paths that exist rather than explaining why a specific desired path is blocked."
 },
 {
  "id": "gen-b-5",
  "source": "authored",
  "domain": 3,
  "topic": "Route 53 Resolver query logging",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team must retain a record of every DNS query made by EC2 instances in 30 VPCs across 12 accounts in an AWS Organization. The records must include the query name, query type, the response code, and the identifier of the instance that made the query. The records must be delivered to a central Amazon S3 bucket in a logging account, and the solution must minimize per-account configuration.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Create a Route 53 Resolver query logging configuration in the logging account, share it with the organization through AWS Resource Access Manager, and associate the shared configuration with each VPC.",
   "B": "Enable VPC Flow Logs in the custom format with the pkt-dstaddr field on all 30 VPCs and deliver the logs to the central S3 bucket.",
   "C": "Enable Amazon GuardDuty in the organization and export the DNS-based findings to the central S3 bucket through Amazon EventBridge.",
   "D": "Create a Route 53 Resolver outbound endpoint in each VPC with a forwarding rule for the dot domain, and configure the target DNS servers to write query logs to the central S3 bucket."
  },
  "answer": [
   "A"
  ],
  "explanation": "Route 53 Resolver query logging captures the queried domain name, record type, response code, and the source instance ID for queries originating in associated VPCs, and it can deliver logs to S3, CloudWatch Logs, or Kinesis Data Firehose. A single query logging configuration can be shared across accounts with AWS RAM and then associated with many VPCs, which centralizes both the destination and the configuration effort. VPC Flow Logs capture IP-level metadata only and never contain domain names, so option B cannot satisfy the requirement. GuardDuty analyzes DNS traffic but emits only findings for suspicious activity, not a complete query record, so option C misses most queries. Option D forces traffic through customer-managed resolvers and adds an outbound endpoint plus DNS server administration in every VPC, which is far more configuration, and it would break the requirement for a low-effort managed record."
 },
 {
  "id": "gen-b-6",
  "source": "authored",
  "domain": 3,
  "topic": "Jumbo frames and MTU",
  "difficulty": "hard",
  "multi": false,
  "question": "A data analytics cluster in a VPC uses an MTU of 9001 bytes between nodes and achieves high throughput. The company connects the VPC to an on-premises data center through AWS Site-to-Site VPN over the internet. After the change, large file transfers between the cluster and on-premises servers stall after the TCP handshake completes, although ping and SSH sessions work normally.\n\nWhat is the MOST likely cause of the issue?",
  "choices": {
   "A": "The Site-to-Site VPN tunnel supports a maximum MTU of 1446 bytes for IPv4 traffic, and ICMP fragmentation needed messages are being blocked, which breaks path MTU discovery.",
   "B": "The virtual private gateway does not support jumbo frames on the AWS side of the tunnel, so the transit gateway must be used instead to enable a 9001-byte MTU end to end.",
   "C": "The instances are using the Intel 82599 virtual function driver instead of the Elastic Network Adapter, which limits the tunnel MTU to 1500 bytes.",
   "D": "The VPN tunnel is negotiating AES-256-GCM, which adds enough IPsec overhead to exceed the 9001-byte MTU of the VPC and causes silent drops."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Site-to-Site VPN tunnels support an MTU of 1446 bytes for IPv4 traffic, so 9001-byte packets from the cluster must be fragmented or rejected. When a router or firewall drops the ICMP type 3 code 4 fragmentation needed message, the sending host never learns to lower its segment size, producing a classic PMTU black hole where small packets such as ping and interactive SSH succeed but bulk transfers stall. Transit gateway also caps VPN attachment traffic at the same 1446-byte tunnel MTU, so option B does not fix anything. The network driver in use does not change the tunnel MTU, making option C irrelevant. IPsec overhead reduces the usable payload below 1500 bytes but does not interact with the 9001-byte VPC MTU in the way option D describes."
 },
 {
  "id": "gen-b-7",
  "source": "authored",
  "domain": 4,
  "topic": "AWS Network Firewall",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must allow its private EC2 instances to reach only a specific list of external HTTPS domains, such as updates.example.com and packages.example.net. All other outbound internet traffic must be blocked. The instances reach the internet through a NAT gateway in a public subnet. The company cannot install agents or proxy configuration on the instances and must be able to make allow-list changes without redeploying instances.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Deploy AWS Network Firewall in a dedicated firewall subnet in the path to the NAT gateway, and create a stateful rule group with domain list rules that allow the approved HTTPS domains and a default drop action for other traffic.",
   "B": "Create a Route 53 Resolver DNS Firewall rule group that allows the approved domains and blocks all other domains, and associate it with the VPC.",
   "C": "Attach a network ACL to the private subnets that allows outbound TCP port 443 only to the IP addresses that the approved domains currently resolve to.",
   "D": "Create a gateway VPC endpoint for Amazon S3 and an interface VPC endpoint policy that restricts access to the approved domains."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Network Firewall stateful domain list rules inspect the TLS Server Name Indication field for HTTPS and the Host header for HTTP, so they can enforce a domain allow list transparently without any agent or proxy on the instance, and rule groups can be updated at any time. Placing the firewall endpoint in the routing path between the private subnets and the NAT gateway ensures all egress is inspected. Route 53 Resolver DNS Firewall only filters DNS resolution, so an instance that uses a hardcoded IP address or an external resolver bypasses it entirely, making option B insufficient as the sole control. Network ACL IP allow lists break as soon as the domains change addresses, which is common for CDN-hosted repositories, so option C is fragile and high maintenance. VPC endpoints apply only to supported AWS services and cannot control access to arbitrary internet domains, so option D is not applicable."
 },
 {
  "id": "gen-b-8",
  "source": "authored",
  "domain": 4,
  "topic": "Gateway Load Balancer inspection",
  "difficulty": "hard",
  "multi": false,
  "question": "A company deploys a centralized inspection VPC that runs third-party virtual firewall appliances behind a Gateway Load Balancer. Spoke VPCs connect through AWS Transit Gateway, and traffic between spokes is routed to the inspection VPC. Engineers observe that a portion of TCP sessions between two spoke VPCs fail because the appliance sees only one direction of the flow.\n\nWhich configuration change will resolve the issue?",
  "choices": {
   "A": "Enable appliance mode on the Transit Gateway VPC attachment for the inspection VPC.",
   "B": "Enable cross-zone load balancing on the Gateway Load Balancer and set the target group protocol to GENEVE.",
   "C": "Change the Transit Gateway attachment for each spoke VPC to use a separate route table and disable route propagation.",
   "D": "Enable sticky sessions with source IP affinity on the Gateway Load Balancer target group."
  },
  "answer": [
   "A"
  ],
  "explanation": "Without appliance mode, Transit Gateway makes an independent Availability Zone selection for each direction of a flow, so the forward and return packets can enter the inspection VPC in different AZs and reach different appliances, which breaks stateful inspection. Appliance mode on the inspection VPC attachment makes Transit Gateway keep both directions of a flow pinned to the same AZ for the life of the flow. Cross-zone load balancing changes which targets receive traffic but does not fix the AZ asymmetry at the Transit Gateway level, and GENEVE is already the required Gateway Load Balancer protocol. Separate route tables control which destinations are reachable, not flow symmetry. Gateway Load Balancer already uses 5-tuple flow stickiness to a single appliance within a zone, so option D does not address a cross-AZ imbalance."
 },
 {
  "id": "gen-b-9",
  "source": "authored",
  "domain": 4,
  "topic": "AWS Shield Advanced and DDoS",
  "difficulty": "medium",
  "multi": true,
  "question": "A public web application runs behind an Application Load Balancer with Amazon CloudFront in front of it. During a recent volumetric attack, the origin ALB became saturated and the application was unavailable. Management requires proactive engagement from AWS during future attacks, cost protection against scaling charges caused by attacks, and assurance that attackers cannot bypass CloudFront by targeting the ALB directly.\n\nWhich combination of actions will meet these requirements? (Select TWO.)",
  "choices": {
   "A": "Subscribe to AWS Shield Advanced, add the CloudFront distribution and the ALB as protected resources, and configure the Shield Response Team proactive engagement contacts.",
   "B": "Restrict the ALB security group to the CloudFront managed prefix list, and add a custom header at CloudFront that an AWS WAF rule on the ALB requires.",
   "C": "Enable AWS Shield Standard on the ALB and create a CloudWatch alarm on the DDoSDetected metric with an Amazon SNS notification.",
   "D": "Replace the Application Load Balancer with a Network Load Balancer and place an Elastic IP address on each subnet to absorb the attack volume.",
   "E": "Enable Amazon GuardDuty in the account and create an EventBridge rule that scales the ALB target group when a DDoS finding is generated."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Shield Advanced provides proactive engagement by the Shield Response Team and DDoS cost protection for scaling charges on protected resources, and both the distribution and the ALB should be protected so that layer 3 and 4 attacks on either are covered. Locking the ALB security group to the com.amazonaws.global.cloudfront.origin-facing managed prefix list plus verifying a secret custom header injected by CloudFront prevents attackers from reaching the origin directly and from spoofing a different distribution. Shield Standard is always on and free but provides no response team engagement or cost protection, so option C does not satisfy the requirements. Swapping to a Network Load Balancer with Elastic IP addresses does not add DDoS capacity and would remove ALB layer 7 features. GuardDuty does not detect volumetric DDoS against an ALB and scaling a target group in response is not a mitigation for the described attack."
 },
 {
  "id": "gen-b-10",
  "source": "authored",
  "domain": 4,
  "topic": "AWS WAF",
  "difficulty": "medium",
  "multi": false,
  "question": "An ecommerce site is experiencing credential stuffing against its login endpoint at /api/login. Attack traffic originates from thousands of distinct IP addresses, and each address sends only a few requests per minute, so an IP-based rate limit at a reasonable threshold does not trigger. Legitimate customers must not be blocked, and the company wants a managed solution that does not require changes to the application code.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Add the AWS WAF Bot Control managed rule group in targeted inspection level along with the account takeover prevention managed rule group scoped to the login endpoint.",
   "B": "Create an AWS WAF rate-based rule with a limit of 100 requests per 5 minutes and an aggregate key of the HTTP method.",
   "C": "Attach an AWS Network Firewall stateful rule group that drops TCP connections with more than five requests to the /api/login path.",
   "D": "Enable AWS Shield Advanced automatic application layer DDoS mitigation on the distribution and set the action to count."
  },
  "answer": [
   "A"
  ],
  "explanation": "The AWS WAF Fraud Control account takeover prevention managed rule group is designed for exactly this pattern: it inspects login attempts, detects stolen credential use and missing browser signals, and works with Bot Control targeted inspection, which uses client-side challenges and browser fingerprinting to detect distributed automation that stays under IP rate limits. Neither requires application code changes beyond configuring the login request path and field names in the rule group. A rate-based rule keyed on HTTP method aggregates all POST traffic globally and would either never fire or block legitimate users indiscriminately. AWS Network Firewall operates on network and TLS-layer attributes and cannot count HTTP requests to a URI path inside an encrypted session terminated at the load balancer. Shield Advanced layer 7 automatic mitigation targets volumetric HTTP floods, and setting it to count would not block anything."
 },
 {
  "id": "gen-b-11",
  "source": "authored",
  "domain": 3,
  "topic": "Transit Gateway CloudWatch metrics",
  "difficulty": "medium",
  "multi": false,
  "question": "A network operations team must be alerted when packets are being dropped by AWS Transit Gateway because no matching route exists in the associated Transit Gateway route table. The alert must fire within a few minutes of the condition starting.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Create a CloudWatch alarm on the PacketDropCountNoRoute metric in the AWS/TransitGateway namespace with a period of 5 minutes and a Sum statistic.",
   "B": "Create a CloudWatch alarm on the PacketDropCountBlackhole metric in the AWS/TransitGateway namespace with a period of 5 minutes and a Sum statistic.",
   "C": "Enable Transit Gateway Flow Logs and create a metric filter that matches records where the action field equals REJECT, then alarm on the metric filter.",
   "D": "Create a CloudWatch alarm on the BytesDropCountNoRoute metric in the AWS/EC2 namespace with a period of 1 minute and an Average statistic."
  },
  "answer": [
   "A"
  ],
  "explanation": "Transit Gateway publishes PacketDropCountNoRoute to the AWS/TransitGateway namespace, which counts packets dropped because they did not match a route in the Transit Gateway route table, and a Sum statistic over a short period gives a timely alarm. PacketDropCountBlackhole counts a different condition, packets dropped because they matched a route explicitly configured as a blackhole, so it would miss the missing-route case. Transit Gateway Flow Logs do exist and record a REJECT action, but building a metric filter adds delivery latency and extra configuration compared with a metric that is already published, and REJECT covers multiple drop reasons. The metrics are not in the AWS/EC2 namespace, so option D references a metric that does not exist there."
 },
 {
  "id": "gen-b-12",
  "source": "authored",
  "domain": 4,
  "topic": "MACsec on Direct Connect",
  "difficulty": "hard",
  "multi": false,
  "question": "A financial services company must encrypt all traffic that traverses its 10 Gbps dedicated AWS Direct Connect connection at layer 2, with no reduction in effective throughput and no per-packet overhead from an IPsec tunnel. The company terminates the circuit on its own router in the Direct Connect location cage.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Enable MACsec on the dedicated Direct Connect connection and associate a connection key name and connectivity association key with the connection, matching the configuration on the customer router.",
   "B": "Configure an AWS Site-to-Site VPN with the private IP VPN option running over a Direct Connect transit virtual interface and enable AES-256-GCM.",
   "C": "Create a public virtual interface on the connection and enable TLS 1.3 with AWS Certificate Manager on all endpoints that receive traffic.",
   "D": "Request a hosted connection of 10 Gbps from a Direct Connect Partner and enable MACsec on the hosted virtual interface."
  },
  "answer": [
   "A"
  ],
  "explanation": "MACsec (IEEE 802.1AE) provides line-rate layer 2 encryption on supported dedicated Direct Connect connections of 10, 100, and 400 Gbps, and is configured by associating a CKN and CAK pair on the AWS connection that matches the customer router. Because it operates in hardware at the port, it adds essentially no throughput penalty, meeting the requirement. Private IP VPN over Direct Connect is IPsec, which adds per-packet overhead and reduces the effective MTU and throughput, so option B conflicts with the stated constraints. TLS terminated at application endpoints does not encrypt all traffic on the circuit and is not a layer 2 control, so option C misses the requirement. MACsec is a property of a dedicated connection, not of a hosted connection or of a virtual interface, so option D describes a configuration that is not available."
 },
 {
  "id": "gen-b-13",
  "source": "authored",
  "domain": 3,
  "topic": "Asymmetric routing",
  "difficulty": "hard",
  "multi": false,
  "question": "A company connects its data center to AWS with both an AWS Direct Connect private virtual interface and a Site-to-Site VPN as a backup, both attached to the same Transit Gateway. The on-premises router advertises 192.168.0.0/16 over both paths. A stateful on-premises firewall sits inline on the Direct Connect path only. Users report that new TCP connections from on premises to EC2 instances succeed, but connections initiated from AWS to on-premises servers are reset.\n\nWhat is the MOST likely cause of the issue?",
  "choices": {
   "A": "Transit Gateway prefers the Direct Connect path for traffic toward on premises while return traffic arrives over the VPN, so the on-premises stateful firewall sees an out-of-state segment and resets the connection.",
   "B": "The Transit Gateway route table contains a blackhole route for 192.168.0.0/16 that intermittently drops the AWS-to-on-premises SYN packets.",
   "C": "The Site-to-Site VPN tunnel is configured for policy-based routing, which prevents any AWS-initiated traffic from being encapsulated.",
   "D": "Equal-cost multipath is enabled across the Direct Connect virtual interface and the VPN attachment, so packets in a single flow are sprayed across both paths."
  },
  "answer": [
   "A"
  ],
  "explanation": "Transit Gateway route evaluation prefers Direct Connect over VPN for the same prefix, so AWS-originated traffic leaves over Direct Connect and passes through the inline stateful firewall, which creates state. If the on-premises routing policy sends the return traffic back over the VPN, the firewall never sees the reply and the session breaks; conversely, replies to on-premises-initiated flows follow a path that keeps state consistent, which explains why one direction works. A blackhole route would drop traffic entirely rather than produce resets, so option B does not match the symptom. Policy-based VPN affects which traffic is encrypted based on selectors but does not block only AWS-initiated flows in this way. Transit Gateway does not perform ECMP between a Direct Connect Gateway association and a VPN attachment for the same prefix, so option D describes behavior that does not occur."
 },
 {
  "id": "gen-b-14",
  "source": "authored",
  "domain": 4,
  "topic": "VPC endpoint policies and SCPs",
  "difficulty": "hard",
  "multi": true,
  "question": "A regulated company must ensure that EC2 instances in its private VPCs can access only Amazon S3 buckets that belong to its own AWS Organization, and that no principal in any member account can disable or delete the VPC endpoints that enforce this. Internet access from the private subnets is already blocked.\n\nWhich combination of actions will meet these requirements? (Select TWO.)",
  "choices": {
   "A": "Attach a VPC endpoint policy to the S3 gateway endpoint that denies all requests unless aws:PrincipalOrgID and aws:ResourceOrgID match the organization ID.",
   "B": "Attach a service control policy to the organizational unit that denies ec2:DeleteVpcEndpoints and ec2:ModifyVpcEndpoint for all principals except a designated network administration role.",
   "C": "Attach an IAM permissions boundary to every instance profile that denies s3:GetObject for buckets outside the organization.",
   "D": "Create an S3 bucket policy in each bucket that denies access when aws:SourceVpce does not match the endpoint ID, and apply it in every account manually.",
   "E": "Enable Amazon S3 Block Public Access at the account level in all member accounts and enable S3 Access Analyzer."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A VPC endpoint policy is evaluated for every request that traverses the endpoint, and combining aws:PrincipalOrgID with aws:ResourceOrgID restricts traffic to organization principals accessing organization-owned buckets, which is the standard data perimeter pattern. A service control policy that denies the endpoint modification and deletion API actions, with an exception for the designated administration role, prevents member account principals from removing the control, and SCPs cannot be overridden by account administrators. A permissions boundary limits what a role can do but is attached per identity and does not stop other identities or protect the endpoint itself, so option C is incomplete and hard to enforce. Bucket policies applied manually in every account do not scale and only protect the company's own buckets, not access to third-party buckets. Block Public Access and Access Analyzer address public exposure and finding review, not egress to external buckets."
 },
 {
  "id": "gen-b-15",
  "source": "authored",
  "domain": 3,
  "topic": "Enhanced networking and placement groups",
  "difficulty": "medium",
  "multi": false,
  "question": "A high performance computing workload runs on 64 EC2 instances that exchange large volumes of MPI messages. The team needs the lowest possible internode latency and consistent high packet-per-second performance, and the application uses the Libfabric API.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Launch the instances into a cluster placement group in a single Availability Zone and attach an Elastic Fabric Adapter to each instance.",
   "B": "Launch the instances into a spread placement group across three Availability Zones and enable Elastic Network Adapter Express.",
   "C": "Launch the instances into a partition placement group and enable jumbo frames with an MTU of 9001 on all interfaces.",
   "D": "Launch the instances across two Availability Zones behind a Network Load Balancer with cross-zone load balancing disabled."
  },
  "answer": [
   "A"
  ],
  "explanation": "An Elastic Fabric Adapter exposes an OS-bypass interface through Libfabric that lets MPI applications avoid the kernel network stack, which is what delivers the low and consistent latency HPC workloads require. EFA traffic is limited to a single subnet and Availability Zone, and a cluster placement group packs the instances onto closely coupled hardware for the lowest network latency and highest per-flow bandwidth. A spread placement group deliberately separates instances onto distinct hardware and across AZs, which increases latency; ENA Express improves single-flow TCP throughput and tail latency but does not provide OS bypass for MPI. Partition placement groups target large distributed data stores and do not minimize latency, and jumbo frames alone do not address the Libfabric requirement. A Network Load Balancer is irrelevant to peer-to-peer MPI traffic."
 },
 {
  "id": "gen-b-16",
  "source": "authored",
  "domain": 4,
  "topic": "Route 53 Resolver DNS Firewall",
  "difficulty": "medium",
  "multi": false,
  "question": "A security team wants to block DNS resolution of known malicious and low-reputation domains for all workloads in a VPC, and wants to detect but not block newly registered domains while it evaluates the impact. The solution must apply to queries made through the VPC-provided DNS resolver.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Create a Route 53 Resolver DNS Firewall rule group, add the AWS managed malware domain list with a BLOCK action and a domain list of newly registered domains with an ALERT action, and associate the rule group with the VPC.",
   "B": "Create an AWS Network Firewall stateful rule group with Suricata rules that drop UDP port 53 traffic to malicious domains, and route the VPC DNS traffic through the firewall endpoint.",
   "C": "Create a Route 53 Resolver outbound endpoint with forwarding rules that send queries for malicious domains to a sinkhole IP address in the VPC.",
   "D": "Enable GuardDuty DNS protection and create an EventBridge rule that updates a network ACL to block the resolved IP addresses of flagged domains."
  },
  "answer": [
   "A"
  ],
  "explanation": "Route 53 Resolver DNS Firewall filters outbound DNS queries that use the Route 53 Resolver in an associated VPC, supports AWS managed domain lists for malware, botnet command and control, and aggregated threats, and offers ALLOW, BLOCK, and ALERT actions so a rule can log without blocking during evaluation. Associating the rule group with the VPC applies it to all workloads without instance changes. Network Firewall cannot intercept queries to the VPC-provided resolver at the .2 address because that traffic never leaves the subnet through a route table path to a firewall endpoint, so option B fails. Outbound endpoints forward queries to external resolvers by domain, and forwarding rules do not perform threat-list matching or sinkholing on their own. GuardDuty DNS protection detects but does not block, and reacting by editing NACLs is slow, brittle, and does not stop the resolution itself."
 },
 {
  "id": "gen-b-17",
  "source": "authored",
  "domain": 3,
  "topic": "Hybrid DNS troubleshooting",
  "difficulty": "medium",
  "multi": false,
  "question": "A company uses a Route 53 private hosted zone for cloud.example.com associated with a VPC, and forwards queries for corp.example.com to on-premises DNS servers using a Route 53 Resolver outbound endpoint and a forwarding rule. On-premises servers can resolve names in cloud.example.com. However, EC2 instances receive NXDOMAIN when they query hosts in corp.example.com. The outbound endpoint is in the same VPC, and the forwarding rule is associated with the VPC.\n\nWhat is the MOST likely cause of the issue?",
  "choices": {
   "A": "The security group attached to the outbound resolver endpoint does not allow outbound UDP and TCP port 53 to the on-premises DNS servers.",
   "B": "The private hosted zone for cloud.example.com must be disassociated from the VPC before a forwarding rule for a different domain can take effect.",
   "C": "The VPC does not have enableDnsHostnames set to true, which prevents conditional forwarding rules from being evaluated.",
   "D": "An inbound resolver endpoint is required in addition to the outbound endpoint for instances to resolve on-premises names."
  },
  "answer": [
   "A"
  ],
  "explanation": "Outbound Resolver endpoints forward queries from their own elastic network interfaces, so the endpoint security group must permit outbound DNS on UDP and TCP port 53 toward the on-premises resolvers, and the on-premises firewall must permit the return traffic; without it, the forward fails and the resolver returns an error such as NXDOMAIN or SERVFAIL to the instance. Private hosted zones and forwarding rules for different domains coexist without conflict, so option B is false. The enableDnsHostnames attribute governs whether instances receive public DNS hostnames and does not gate forwarding rule evaluation; enableDnsSupport is the attribute that matters for resolver use, and it is already implied by working resolution of cloud.example.com. Inbound endpoints handle queries coming from on premises into AWS, which the scenario states already works, so option D addresses the opposite direction."
 },
 {
  "id": "gen-b-18",
  "source": "authored",
  "domain": 4,
  "topic": "TLS termination and ACM",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must terminate TLS for a public web application and requires that the private key never be exportable and never be handled by application servers. The certificate must renew automatically. The application also requires that traffic between the load balancer and the backend instances be encrypted, and the backend uses self-signed certificates issued by an internal certificate authority.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Request a public certificate in AWS Certificate Manager, attach it to an Application Load Balancer HTTPS listener, and configure the target group protocol as HTTPS so the ALB re-encrypts to the instances.",
   "B": "Import the internal certificate authority certificate into AWS Certificate Manager, attach it to a Network Load Balancer TLS listener, and configure a TCP target group.",
   "C": "Install the ACM public certificate on each EC2 instance by exporting the private key, and use a Network Load Balancer with a TCP passthrough listener.",
   "D": "Request a public certificate in AWS Certificate Manager, attach it to a Gateway Load Balancer listener, and enable TLS inspection on the target appliances."
  },
  "answer": [
   "A"
  ],
  "explanation": "ACM public certificates cannot be exported, are managed entirely by AWS, and renew automatically when attached to an integrated service such as an Application Load Balancer, so the private key is never exposed to the application servers. An ALB with an HTTPS target group protocol establishes a new TLS session to the backends and does not validate the backend certificate chain, so self-signed internal certificates on the instances are acceptable. Option B misuses ACM import for a CA certificate and a TCP target group would not re-encrypt from the load balancer. Option C is impossible because ACM public certificate private keys cannot be exported, and TCP passthrough would place key handling on the instances, violating the requirement. Gateway Load Balancer uses GENEVE for transparent appliance insertion and does not have TLS listeners or ACM certificate attachment."
 },
 {
  "id": "gen-b-19",
  "source": "authored",
  "domain": 3,
  "topic": "NAT gateway troubleshooting",
  "difficulty": "hard",
  "multi": true,
  "question": "A fleet of EC2 instances in a private subnet uses a NAT gateway to poll a single third-party API endpoint. During peak load, applications begin receiving connection timeouts to that endpoint while other internet destinations remain reachable. The NAT gateway CloudWatch metrics show ErrorPortAllocation greater than zero and IdleTimeoutCount rising.\n\nWhich combination of actions will resolve the issue? (Select TWO.)",
  "choices": {
   "A": "Distribute the outbound connections across multiple NAT gateways in different subnets, or use multiple destination IP addresses for the third-party endpoint.",
   "B": "Reduce connection churn by enabling HTTP keep-alive and connection pooling in the application so that fewer simultaneous source ports are consumed.",
   "C": "Increase the NAT gateway idle timeout from 350 seconds to 3600 seconds by using the ModifyNatGatewayAttribute API.",
   "D": "Replace the NAT gateway with a NAT instance running on a larger instance type and enable source/destination check.",
   "E": "Attach a second Elastic IP address to the existing NAT gateway and enable per-flow hashing across the addresses."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "A NAT gateway supports up to 55,000 simultaneous connections to each unique destination IP address and port combination, so a fleet hammering one endpoint exhausts the port range and produces ErrorPortAllocation. Spreading load across additional NAT gateways gives each its own port pool for that destination, and reducing connection churn through keep-alive and pooling lowers the number of concurrent translations needed. The NAT gateway idle timeout is fixed at 350 seconds and cannot be changed, so option C describes a nonexistent capability. A NAT instance has lower connection scale and throughput than a NAT gateway and requires disabling the source/destination check, not enabling it, so option D is both wrong and a regression. A NAT gateway supports secondary IPv4 addresses to expand port capacity but they are secondary private addresses managed through AssignPrivateNatGatewayAddress, not additional Elastic IPs with customer-configured per-flow hashing, so option E as written is not a valid configuration."
 },
 {
  "id": "gen-b-20",
  "source": "authored",
  "domain": 4,
  "topic": "Centralized egress inspection",
  "difficulty": "hard",
  "multi": false,
  "question": "An organization has 40 spoke VPCs attached to a Transit Gateway. All internet-bound traffic must egress through a single inspection VPC where AWS Network Firewall inspects it, and the design must minimize the number of NAT gateways and firewall endpoints while remaining highly available across three Availability Zones.\n\nWhich architecture will meet these requirements?",
  "choices": {
   "A": "In the inspection VPC, create one firewall subnet and one NAT gateway subnet per Availability Zone, route the Transit Gateway attachment subnets to the firewall endpoints, route the firewall subnets to the NAT gateways, and point spoke VPC default routes at the Transit Gateway.",
   "B": "In each spoke VPC, deploy a NAT gateway per Availability Zone and route the resulting egress traffic to the Transit Gateway so it reaches the inspection VPC firewall endpoints.",
   "C": "In the inspection VPC, place a single firewall endpoint and a single NAT gateway in one Availability Zone, and use a Transit Gateway route table with a default route to that attachment.",
   "D": "Attach an internet gateway to the Transit Gateway and associate an AWS Network Firewall policy directly with the Transit Gateway route table."
  },
  "answer": [
   "A"
  ],
  "explanation": "The standard centralized egress pattern places Transit Gateway attachment subnets, firewall subnets, and NAT gateway subnets in each of the three Availability Zones of a single inspection VPC, with a default route in the spoke VPCs pointing at the Transit Gateway. Traffic flows from the attachment subnet to the zonal firewall endpoint, then to the zonal NAT gateway, then to the internet gateway, keeping traffic within an AZ and providing HA with only three NAT gateways for all 40 VPCs. Deploying NAT gateways in every spoke multiplies cost and defeats the purpose of centralization. A single-AZ inspection path is not highly available and creates cross-AZ data charges for the other two zones. Transit Gateway cannot have an internet gateway attachment, and Network Firewall policies are associated with a firewall deployed in VPC subnets, not with a Transit Gateway route table, so option D is not possible."
 },
 {
  "id": "gen-b-21",
  "source": "authored",
  "domain": 3,
  "topic": "Traffic Mirroring",
  "difficulty": "medium",
  "multi": false,
  "question": "A security operations team must capture full packet payloads from a subset of EC2 instances for intrusion detection analysis. The team needs to filter the captured traffic to include only TCP port 445 and TCP port 3389 and must send the capture to a fleet of analysis appliances that scale automatically.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Create a Traffic Mirror filter with rules for TCP ports 445 and 3389, create a Traffic Mirror target that references a Network Load Balancer in front of the analysis fleet, and create Traffic Mirror sessions on the source instance network interfaces.",
   "B": "Enable VPC Flow Logs with a custom format including the tcp-flags field, filter for ports 445 and 3389, and stream the logs to the analysis fleet using Kinesis Data Firehose.",
   "C": "Create a Traffic Mirror session that targets an Application Load Balancer and use a listener rule to match TCP ports 445 and 3389.",
   "D": "Deploy a Gateway Load Balancer endpoint in the source subnet and route only TCP ports 445 and 3389 to it with route table entries."
  },
  "answer": [
   "A"
  ],
  "explanation": "Traffic Mirroring copies full packets, including payloads, from an elastic network interface, and Traffic Mirror filters define inbound and outbound rules by protocol and port range so only SMB and RDP traffic is mirrored. A Network Load Balancer with a UDP listener on port 4789 is a supported mirror target and lets the analysis fleet scale behind a target group. VPC Flow Logs are metadata only and never contain payloads, so option B cannot support payload-based intrusion detection. Application Load Balancers are not valid Traffic Mirror targets and operate at layer 7 on HTTP, so option C is invalid. Route tables match on destination prefix only and cannot select traffic by TCP port, so option D cannot express the required filter, and Gateway Load Balancer inserts an inline appliance rather than providing a copy for passive analysis."
 },
 {
  "id": "gen-b-22",
  "source": "authored",
  "domain": 4,
  "topic": "GuardDuty for networking",
  "difficulty": "medium",
  "multi": false,
  "question": "A company wants to detect when EC2 instances in its VPCs communicate with known cryptocurrency mining pools or command and control infrastructure, and wants detections to work even when the instances use a third-party DNS resolver instead of the VPC-provided resolver. The company has already disabled VPC Flow Logs to reduce cost.\n\nWhich statement about the detection capability is correct?",
  "choices": {
   "A": "GuardDuty analyzes an independent copy of VPC flow log data and does not require the customer to enable VPC Flow Logs, but its DNS-based findings apply only to queries that use the AWS provided DNS resolver.",
   "B": "GuardDuty requires customer-enabled VPC Flow Logs delivered to CloudWatch Logs before it can generate any network-based findings.",
   "C": "GuardDuty inspects the payload of all VPC traffic through Traffic Mirroring sessions that it creates automatically in each VPC.",
   "D": "GuardDuty DNS findings work with any resolver because GuardDuty inspects UDP port 53 packets inline at the network interface."
  },
  "answer": [
   "A"
  ],
  "explanation": "GuardDuty consumes an independent internal stream of VPC flow log data, DNS logs, and CloudTrail events, so customers do not need to enable VPC Flow Logs and are not billed for GuardDuty's copy. Its DNS-based detections rely on Route 53 Resolver data, so instances configured to use a third-party resolver bypass that data source and DNS findings will not be generated for those queries, though flow-based findings such as CryptoCurrency:EC2/BitcoinTool.B still apply. Option B is wrong because customer flow logs are not a prerequisite. GuardDuty does not perform payload inspection or create Traffic Mirroring sessions, so option C is false. GuardDuty is not an inline packet inspection service, which makes option D incorrect."
 },
 {
  "id": "gen-b-23",
  "source": "authored",
  "domain": 3,
  "topic": "Network Access Analyzer",
  "difficulty": "medium",
  "multi": false,
  "question": "A compliance auditor requires evidence that no resource in any production VPC has an unintended network path to the internet, including paths through peering connections, transit gateways, and NAT gateways. The evidence must be produced on demand and must not depend on observing live traffic.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Use AWS Network Access Analyzer with a Network Access Scope that defines internet gateway and NAT gateway destinations, and run the analysis across the production accounts.",
   "B": "Run VPC Reachability Analyzer from every elastic network interface to a public IP address and record the results.",
   "C": "Query VPC Flow Logs in Amazon Athena for records with a destination outside the RFC 1918 ranges over a 90-day period.",
   "D": "Enable AWS Config with the vpc-sg-open-only-to-authorized-ports and restricted-common-ports managed rules."
  },
  "answer": [
   "A"
  ],
  "explanation": "Network Access Analyzer evaluates configuration to find all network paths that match a Network Access Scope, including paths through internet gateways, NAT gateways, peering connections, transit gateways, and VPN, and it produces findings without generating traffic, which is exactly the evidence the auditor needs. Reachability Analyzer tests one source-destination pair at a time and would require an impractical number of analyses to prove the negative across a whole environment. Flow log analysis only shows what actually happened and cannot prove that no unintended path exists. AWS Config managed rules evaluate individual resource properties such as open security group ports and cannot reason about end-to-end reachability through intermediate constructs."
 },
 {
  "id": "gen-b-24",
  "source": "authored",
  "domain": 4,
  "topic": "Security group referencing and segmentation",
  "difficulty": "easy",
  "multi": false,
  "question": "A company is redesigning security controls for a VPC with an autoscaling web tier and an autoscaling application tier. The instance IP addresses change frequently. The security team requires that only web tier instances can reach the application tier on TCP port 8443, with no reliance on CIDR ranges that could later be reused by other workloads.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "In the application tier security group, add an inbound rule for TCP port 8443 whose source is the web tier security group ID.",
   "B": "In the application tier subnet network ACL, add an inbound allow rule for TCP port 8443 whose source is the web tier subnet CIDR block.",
   "C": "In the application tier security group, add an inbound rule for TCP port 8443 whose source is a customer-managed prefix list containing the current web tier instance IP addresses.",
   "D": "Create a separate VPC for each tier and use VPC peering with route tables that permit only TCP port 8443."
  },
  "answer": [
   "A"
  ],
  "explanation": "Referencing a source security group ID in an inbound rule makes membership dynamic, so any instance that joins the web tier Auto Scaling group is immediately authorized and any instance that leaves is immediately deauthorized, with no dependence on IP addressing. A network ACL rule keyed to the subnet CIDR authorizes anything that ever lands in that subnet, which is exactly the CIDR-reuse risk the team wants to avoid, and NACLs are stateless. A customer-managed prefix list would require continuous updates as instances scale and is not automatically maintained. Separate VPCs add significant complexity, and route tables cannot filter by TCP port at all, so option D does not implement the control."
 },
 {
  "id": "gen-b-25",
  "source": "authored",
  "domain": 3,
  "topic": "Direct Connect monitoring",
  "difficulty": "medium",
  "multi": true,
  "question": "A network operations team must be notified when a Direct Connect connection experiences physical layer problems and when a virtual interface loses its BGP session. The team wants to use native CloudWatch metrics only.\n\nWhich combination of metrics should the team alarm on? (Select TWO.)",
  "choices": {
   "A": "ConnectionErrorCount in the AWS/DX namespace, which reports MAC-level cyclic redundancy check errors on the connection.",
   "B": "VirtualInterfaceBgpPeerState in the AWS/DX namespace, which reports whether the BGP peering session is established.",
   "C": "ConnectionBpsEgress in the AWS/DX namespace with a static threshold of zero bytes per second.",
   "D": "TunnelState in the AWS/VPN namespace filtered by the Direct Connect virtual interface dimension.",
   "E": "ConnectionPpsIngress in the AWS/DX namespace with anomaly detection enabled."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "ConnectionErrorCount reports the count of MAC-level errors such as CRC errors on a Direct Connect connection and is the canonical signal for physical layer or optical problems on the circuit. VirtualInterfaceBgpPeerState reports the state of the BGP peering session for a virtual interface, with 1 indicating established and 0 indicating down, so it directly satisfies the BGP requirement. Alarming on zero egress bits per second is an indirect and noisy proxy that would false-alarm during quiet periods and would not distinguish physical faults. TunnelState belongs to the AWS/VPN namespace for Site-to-Site VPN tunnels and has no Direct Connect virtual interface dimension. Anomaly detection on packet rate detects traffic pattern changes, not link errors or BGP state."
 },
 {
  "id": "gen-b-26",
  "source": "authored",
  "domain": 4,
  "topic": "AWS Firewall Manager governance",
  "difficulty": "medium",
  "multi": false,
  "question": "A company with 200 AWS accounts in an organization must guarantee that every current and future Application Load Balancer is associated with a baseline AWS WAF web ACL containing the core rule set, and that account owners cannot remove the association. The security team operates from a dedicated security account.\n\nWhich solution will meet these requirements with the least ongoing effort?",
  "choices": {
   "A": "Designate the security account as the AWS Firewall Manager administrator and create a Firewall Manager WAF policy scoped to all accounts and to Application Load Balancer resources, with automatic remediation enabled.",
   "B": "Write an AWS Config custom rule with an automatic remediation action that runs an SSM Automation document to attach the web ACL, and deploy it with a conformance pack in each account.",
   "C": "Use an SCP that denies elasticloadbalancing:CreateLoadBalancer unless the request includes a wafv2 web ACL association parameter.",
   "D": "Create a CloudFormation StackSet that provisions a web ACL in every account and instructs teams to associate it with their load balancers."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Firewall Manager is purpose-built for this: a WAF policy in the Firewall Manager administrator account applies a common web ACL to in-scope resources across all organization accounts, continuously discovers new resources, and automatically remediates non-compliant ones so account owners cannot leave a load balancer unprotected. Config with custom remediation could approximate the outcome but requires building and maintaining rules, automation documents, and per-account deployment, which is much more effort. An SCP cannot inspect a web ACL association because CreateLoadBalancer has no such request parameter, so option C would not work. A StackSet that only creates web ACLs and relies on team discipline provides no enforcement at all."
 },
 {
  "id": "gen-b-27",
  "source": "authored",
  "domain": 3,
  "topic": "Load balancer metrics troubleshooting",
  "difficulty": "medium",
  "multi": false,
  "question": "Users intermittently receive HTTP 503 errors from an application behind an Application Load Balancer. CloudWatch shows HTTPCode_ELB_5XX_Count rising while HTTPCode_Target_5XX_Count remains near zero, and the HealthyHostCount for the target group periodically drops to zero in one Availability Zone.\n\nWhat is the MOST likely cause of the issue?",
  "choices": {
   "A": "The load balancer has no healthy targets registered in that Availability Zone, so it returns 503 Service Unavailable for requests routed there.",
   "B": "The targets are returning 503 responses that the load balancer is passing through unchanged to clients.",
   "C": "The load balancer is exhausting its ephemeral ports to the targets, which produces 503 responses and reduces HealthyHostCount.",
   "D": "The listener certificate has expired, so the load balancer terminates TLS with a 503 status code before reaching the targets."
  },
  "answer": [
   "A"
  ],
  "explanation": "HTTPCode_ELB_5XX_Count counts responses generated by the load balancer itself, and a 503 specifically means the load balancer had no healthy target available for the request, which matches HealthyHostCount dropping to zero in one AZ while target-generated 5XX counts stay flat. If targets were producing the errors, HTTPCode_Target_5XX_Count would rise instead, which rules out option B. Connection or capacity exhaustion between the load balancer and targets does not present as zero healthy hosts and would more likely surface as 502 or 504 along with target connection errors. An expired certificate causes a TLS handshake failure at the client, not an HTTP 503, so option D does not match the observed metrics."
 },
 {
  "id": "gen-b-28",
  "source": "authored",
  "domain": 4,
  "topic": "Private connectivity to services",
  "difficulty": "medium",
  "multi": true,
  "question": "A software vendor exposes an application to customer VPCs through AWS PrivateLink. The vendor must ensure that only approved customer AWS accounts can create interface endpoints to the service, that connection requests from other accounts are never automatically accepted, and that customer traffic reaching the service preserves the ability to identify the originating endpoint.\n\nWhich combination of configurations will meet these requirements? (Select TWO.)",
  "choices": {
   "A": "Disable acceptance required is left off, meaning acceptance is required, and add only the approved customer account principals to the endpoint service allowed principals list.",
   "B": "Enable Proxy Protocol version 2 on the Network Load Balancer target group so the service receives the endpoint ID and source address information.",
   "C": "Attach a VPC endpoint policy in the vendor account that denies all principals outside the approved account list.",
   "D": "Enable client IP preservation on the Network Load Balancer target group so the customer VPC private IP address is preserved end to end.",
   "E": "Create a Route 53 private hosted zone in the vendor VPC that resolves the service name to the customer endpoint IP addresses."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "Requiring acceptance on the endpoint service prevents automatic connection establishment, and the allowed principals list restricts which accounts can even discover and request the service, so together they enforce the approval model. Enabling Proxy Protocol v2 on the Network Load Balancer causes AWS to prepend a header containing the VPC endpoint ID, which is how a PrivateLink service provider identifies the originating endpoint since the source address it sees belongs to the NLB. VPC endpoint policies are configured by the consumer on their own endpoint and control which service actions the consumer's principals may call; they do not gate who may connect to a provider's endpoint service. Client IP preservation is not supported for traffic arriving through a PrivateLink endpoint service, so option D is not achievable. A private hosted zone in the vendor VPC does not affect customer-side resolution or access control."
 },
 {
  "id": "gen-b-29",
  "source": "authored",
  "domain": 3,
  "topic": "TCP tuning and throughput",
  "difficulty": "hard",
  "multi": false,
  "question": "A team transfers large files between an EC2 instance in the us-east-1 Region and an on-premises server over a 10 Gbps Direct Connect connection with 60 ms of round-trip latency. A single TCP stream achieves only about 90 Mbps even though the link is otherwise idle and packet loss is negligible. The instance type supports 10 Gbps of network bandwidth.\n\nWhat is the MOST likely cause, and what should the team do?",
  "choices": {
   "A": "The TCP receive window is limiting the bandwidth-delay product; increase the TCP window scaling and socket buffer sizes on both endpoints, or use parallel TCP streams.",
   "B": "The instance is being throttled by its network burst credit balance; move to an instance type with baseline 10 Gbps bandwidth and enable ENA Express.",
   "C": "The Direct Connect virtual interface is limited to 100 Mbps until a higher bandwidth is provisioned on the virtual interface; request a bandwidth increase on the VIF.",
   "D": "The path MTU is 1500 bytes instead of 9001 bytes; enable jumbo frames on the Direct Connect virtual interface to reach line rate on a single stream."
  },
  "answer": [
   "A"
  ],
  "explanation": "Single-stream TCP throughput is bounded by the receive window divided by the round-trip time, and a default 64 KB window over a 60 ms RTT yields roughly 8.7 Mbps, while the observed 90 Mbps corresponds to a window near 700 KB; either way the bandwidth-delay product for 10 Gbps at 60 ms requires tens of megabytes of buffer. Enabling window scaling with larger socket buffers, or splitting the transfer across parallel streams, is the standard remedy. Burst credits apply to smaller instance types, and the scenario states the instance supports 10 Gbps sustained, so option B does not fit. Direct Connect virtual interfaces on a dedicated connection are not capped at 100 Mbps and there is no per-VIF bandwidth request of that kind on a dedicated connection. Jumbo frames help reduce per-packet overhead and Direct Connect private VIFs do support 9001 bytes, but MTU alone cannot overcome a window that is orders of magnitude too small for the bandwidth-delay product."
 },
 {
  "id": "gen-b-30",
  "source": "authored",
  "domain": 4,
  "topic": "IPsec and encryption in transit",
  "difficulty": "medium",
  "multi": false,
  "question": "A company requires that all traffic between its on-premises data center and AWS be encrypted, and that the traffic never traverse the public internet. The company already has a 10 Gbps Direct Connect connection with a transit virtual interface to a Direct Connect gateway associated with a Transit Gateway. Throughput of at least 4 Gbps of encrypted traffic is required across a single logical connection.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Configure AWS Site-to-Site VPN with the private IP VPN option over the Direct Connect transit virtual interface, and enable acceleration through multiple tunnels with ECMP on the Transit Gateway.",
   "B": "Configure a public virtual interface and build a standard Site-to-Site VPN to the Transit Gateway over the Direct Connect public VIF.",
   "C": "Enable MACsec on the transit virtual interface and set the Transit Gateway attachment to require encryption.",
   "D": "Enable AWS Transit Gateway inter-region peering encryption between the on-premises router and the Transit Gateway."
  },
  "answer": [
   "A"
  ],
  "explanation": "Private IP VPN runs an IPsec Site-to-Site VPN over a Direct Connect transit virtual interface using private IP addresses, so the encrypted traffic stays entirely on the Direct Connect path and never touches the public internet. Because a single IPsec tunnel is limited to roughly 1.25 Gbps, achieving 4 Gbps requires multiple tunnels with equal-cost multipath enabled on the Transit Gateway, which distributes flows across them. A VPN over a public virtual interface does keep traffic on the Direct Connect circuit but uses public IP addresses for the tunnel endpoints and is the older pattern; more importantly it does not satisfy a private addressing requirement and still requires ECMP for throughput, making option A the better fit. MACsec is configured on a dedicated connection port, not on a virtual interface, and there is no Transit Gateway attachment setting that requires encryption. Transit Gateway peering encryption applies between Transit Gateways in different Regions, not to an on-premises router."
 },
 {
  "id": "gen-b-31",
  "source": "authored",
  "domain": 3,
  "topic": "Route propagation and route priority",
  "difficulty": "hard",
  "multi": false,
  "question": "A VPC subnet route table contains a propagated route for 10.20.0.0/16 pointing to a virtual private gateway, a static route for 10.20.0.0/16 pointing to a Transit Gateway attachment, and a static route for 10.20.5.0/24 pointing to a NAT gateway. An EC2 instance in the subnet sends a packet to 10.20.5.10.\n\nWhich target will receive the packet?",
  "choices": {
   "A": "The NAT gateway, because the most specific matching route always wins regardless of whether the route is static or propagated.",
   "B": "The Transit Gateway attachment, because static routes are always preferred over propagated routes and over less specific entries.",
   "C": "The virtual private gateway, because propagated BGP routes take precedence over statically configured routes in a VPC route table.",
   "D": "The packet is dropped, because a route table cannot contain overlapping static and propagated routes for the same prefix."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC route tables evaluate longest prefix match first, so a /24 entry beats any /16 entry regardless of how the routes were created. Only when two routes have identical destination prefixes does the static-versus-propagated tiebreaker apply, and in that case the static route wins. Option B applies the tiebreaker before longest prefix match, which reverses the actual evaluation order. Option C states the tiebreaker backwards, since static routes are preferred over propagated routes for identical prefixes. Overlapping routes with different prefix lengths are legal and common, so nothing is dropped and option D is incorrect."
 },
 {
  "id": "gen-b-32",
  "source": "authored",
  "domain": 4,
  "topic": "AWS WAF logging and compliance",
  "difficulty": "easy",
  "multi": false,
  "question": "A compliance program requires that all AWS WAF requests that match a rule be logged with the matching rule identifier and selected request headers, retained for seven years, and made queryable with SQL. The company also wants to redact the Authorization header from the logs.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Enable AWS WAF logging to an Amazon S3 bucket with a lifecycle policy for long-term retention, configure redacted fields for the Authorization header, and query the logs with Amazon Athena.",
   "B": "Enable AWS WAF logging to Amazon CloudWatch Logs with a retention setting of seven years, and use CloudWatch Logs Insights with a filter that removes the Authorization header at query time.",
   "C": "Enable AWS CloudTrail data events for wafv2 and deliver them to Amazon S3, then query them with Amazon Athena.",
   "D": "Enable VPC Flow Logs on the subnets that host the Application Load Balancer and deliver them to Amazon S3 in Apache Parquet format."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS WAF can log directly to Amazon S3, CloudWatch Logs, or Kinesis Data Firehose, and the logging configuration supports redacted fields so sensitive headers such as Authorization are replaced before the record is written. S3 with lifecycle rules gives cost-effective multi-year retention, and Athena provides SQL querying over the JSON log files. CloudWatch Logs retention does support very long periods, but redaction at query time still means the sensitive header was stored, which violates the redaction requirement, and Logs Insights is not SQL. CloudTrail records management and data API calls to the WAF service, not per-request rule matches. VPC Flow Logs contain no HTTP-layer information at all."
 },
 {
  "id": "gen-b-33",
  "source": "authored",
  "domain": 3,
  "topic": "VPN tunnel troubleshooting",
  "difficulty": "medium",
  "multi": false,
  "question": "An AWS Site-to-Site VPN connection to a Transit Gateway uses BGP. Both tunnels show the IPsec status as UP in the console, but the BGP session on tunnel 1 remains in the idle state while tunnel 2 is established. On-premises engineers confirm the customer gateway is configured with the correct AWS BGP peer IP address and ASN for both tunnels.\n\nWhat is the MOST likely cause of the issue?",
  "choices": {
   "A": "The on-premises firewall is not permitting TCP port 179 and the ephemeral ports for the tunnel 1 inside IP address range.",
   "B": "The customer gateway device is configured with the same inside tunnel CIDR for both tunnels, which is not supported.",
   "C": "The Transit Gateway route table does not have a propagated route for the on-premises prefix, which prevents the BGP session from establishing on tunnel 1.",
   "D": "The VPN connection is configured for static routing, so BGP can establish on only one tunnel at a time."
  },
  "answer": [
   "A"
  ],
  "explanation": "BGP runs over TCP port 179 between the inside tunnel addresses, so an IPsec tunnel can be fully established while the BGP session stays idle if a firewall or ACL blocks TCP 179 or the associated ephemeral ports for that specific tunnel's inside address range. Because tunnel 2 works, the failure is specific to the tunnel 1 inside addressing path rather than a global configuration problem. Duplicate inside CIDRs would generally prevent the tunnels from being provisioned or would cause conflicts on both tunnels, not one. Route propagation is a consequence of an established BGP session, not a prerequisite, so option C inverts the dependency. A statically routed VPN would show no BGP session at all rather than one established and one idle."
 },
 {
  "id": "gen-b-34",
  "source": "authored",
  "domain": 4,
  "topic": "Network segmentation with Transit Gateway",
  "difficulty": "medium",
  "multi": false,
  "question": "A company must ensure that its production VPCs and development VPCs cannot communicate with each other, while both must reach a shared services VPC and both must reach on premises through a Direct Connect gateway attachment. All VPCs attach to a single Transit Gateway.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Create separate Transit Gateway route tables for production and development, associate each set of attachments with its own route table, and propagate only the shared services and Direct Connect gateway attachments into both.",
   "B": "Use a single Transit Gateway route table with propagation enabled for all attachments, and add blackhole routes for each production VPC CIDR and each development VPC CIDR.",
   "C": "Apply network ACLs on the shared services VPC subnets that deny traffic between the production and development CIDR ranges.",
   "D": "Create a Transit Gateway Connect attachment for the production VPCs and a separate Transit Gateway peering attachment for the development VPCs."
  },
  "answer": [
   "A"
  ],
  "explanation": "Transit Gateway segmentation is achieved with route table associations and propagations: each attachment is associated with exactly one route table that determines what it can reach, and propagating only the shared services and Direct Connect gateway attachments into both route tables gives each environment access to shared services and on premises without a route to the other environment. Blackhole routes on a single shared route table can work in narrow cases but require a maintenance burden that grows with every new VPC CIDR and is error prone, and it is not the recommended segmentation model. NACLs in the shared services VPC do not prevent production-to-development traffic, which would never traverse that VPC. Connect attachments are for SD-WAN appliances using GRE and peering attachments join two Transit Gateways, so neither construct applies to VPC segmentation."
 },
 {
  "id": "gen-b-35",
  "source": "authored",
  "domain": 3,
  "topic": "Flow log analysis at scale",
  "difficulty": "medium",
  "multi": false,
  "question": "A company generates several terabytes of VPC Flow Logs per day across hundreds of VPCs. Analysts need to run ad hoc SQL queries filtered by date and account, and the company must minimize both storage cost and the amount of data scanned per query.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Deliver the flow logs to Amazon S3 in Apache Parquet format with Hive-compatible S3 prefixes and hourly partitions, then query with Amazon Athena using partition projection.",
   "B": "Deliver the flow logs to Amazon CloudWatch Logs and use CloudWatch Logs Insights with a query that filters on the account ID field.",
   "C": "Deliver the flow logs to Amazon S3 in plain text format and use Amazon Athena with a table that has no partitions, relying on Athena result caching.",
   "D": "Deliver the flow logs to Amazon Kinesis Data Streams and use Amazon Managed Service for Apache Flink to write aggregates into Amazon DynamoDB."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC Flow Logs can be delivered directly to S3 in Parquet with Hive-compatible prefixes and hourly partitioning, which cuts storage size substantially through columnar compression and lets Athena prune both partitions and columns so queries scan far less data. Partition projection removes the need to run repeated partition-loading operations against a very large table. CloudWatch Logs ingestion and storage at terabyte-per-day scale is significantly more expensive, and Logs Insights is not SQL. An unpartitioned plain-text table forces every query to scan the entire dataset, and result caching only helps identical repeated queries. A streaming aggregation pipeline into DynamoDB precomputes fixed metrics and cannot support arbitrary ad hoc SQL over raw records."
 },
 {
  "id": "gen-b-36",
  "source": "authored",
  "domain": 4,
  "topic": "Network Firewall TLS inspection",
  "difficulty": "hard",
  "multi": false,
  "question": "A company must inspect the contents of outbound HTTPS traffic from its VPC for data loss prevention signatures, not merely the SNI hostname. The company uses AWS Network Firewall for centralized egress inspection and controls the operating system image used by all instances.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Configure a TLS inspection configuration on the AWS Network Firewall that references an AWS Private Certificate Authority certificate in AWS Certificate Manager, and distribute the CA certificate to the instance trust stores.",
   "B": "Create a stateful rule group with Suricata rules that match on the tls.sni keyword and inspect the payload with the content keyword.",
   "C": "Enable Traffic Mirroring from the firewall endpoints to an out-of-band DLP appliance and configure the appliance with the public certificate of each destination site.",
   "D": "Attach an AWS WAF web ACL with a body inspection rule to the AWS Network Firewall endpoint."
  },
  "answer": [
   "A"
  ],
  "explanation": "AWS Network Firewall supports TLS inspection configurations for both outbound and inbound traffic; for egress it decrypts the session using a certificate issued from AWS Private CA in ACM, inspects the plaintext against stateful rules, then re-encrypts. Because the firewall presents a certificate signed by that private CA, the CA certificate must be present in the trust store of every client instance or connections will fail validation. Suricata content matching cannot see inside an encrypted stream, so option B can only match the unencrypted SNI in the ClientHello. Traffic Mirroring delivers a copy of the encrypted packets and having the destination sites' public certificates does not provide their private keys, so decryption is impossible. AWS WAF protects CloudFront, ALB, API Gateway, AppSync, App Runner, Cognito, and Verified Access resources and cannot be attached to a Network Firewall endpoint."
 },
 {
  "id": "gen-b-37",
  "source": "authored",
  "domain": 3,
  "topic": "Connectivity troubleshooting across peering",
  "difficulty": "medium",
  "multi": false,
  "question": "VPC A is peered with VPC B, and VPC B is peered with VPC C. Instances in VPC A can reach instances in VPC B, and instances in VPC B can reach instances in VPC C. Instances in VPC A cannot reach instances in VPC C, even though route tables in VPC A contain a route for the VPC C CIDR pointing to the VPC A to VPC B peering connection.\n\nWhat is the MOST likely cause of the issue?",
  "choices": {
   "A": "VPC peering is not transitive, so traffic from VPC A cannot be forwarded through VPC B to VPC C over the peering connections.",
   "B": "The security groups in VPC C do not allow the VPC A CIDR range, which silently drops the traffic after it transits VPC B.",
   "C": "The VPC A route table entry must point to the VPC B to VPC C peering connection ID rather than the VPC A to VPC B peering connection ID.",
   "D": "Longest prefix match causes VPC A to prefer its local route over the peering route for the VPC C CIDR."
  },
  "answer": [
   "A"
  ],
  "explanation": "VPC peering connections are strictly point to point and non-transitive, so packets from VPC A can never be forwarded by VPC B onto the VPC B to VPC C peering connection regardless of route table entries, and AWS will not even accept the intended forwarding behavior. The correct fix is a direct peering connection between VPC A and VPC C or a Transit Gateway. Security group configuration in VPC C is irrelevant because the packets never arrive. A route table in VPC A cannot reference a peering connection that VPC A is not a participant in, so option C describes an impossible configuration. Local routes only cover the VPC's own CIDR, so no local route would match the VPC C range."
 },
 {
  "id": "gen-b-38",
  "source": "authored",
  "domain": 4,
  "topic": "Certificate management and rotation",
  "difficulty": "medium",
  "multi": true,
  "question": "A company uses AWS Certificate Manager to issue public certificates for Application Load Balancers in several accounts. During an audit, the team discovers that one certificate failed to renew automatically. The company must understand the cause and prevent recurrence for all certificates.\n\nWhich combination of actions will address the situation? (Select TWO.)",
  "choices": {
   "A": "Ensure that each certificate remains associated with an integrated AWS service, because ACM managed renewal requires the certificate to be in use by a supported service for renewal eligibility.",
   "B": "For certificates validated with DNS, verify that the required CNAME validation records still exist in the hosted zone, because ACM re-validates the domain during renewal.",
   "C": "Create an AWS Config rule that automatically exports the ACM private key and re-imports the certificate 30 days before expiration.",
   "D": "Change the certificates from DNS validation to email validation so that renewal notices are sent to the domain administrator, which guarantees renewal.",
   "E": "Increase the ACM certificate validity period to 39 months so that renewal is required less frequently."
  },
  "answer": [
   "A",
   "B"
  ],
  "explanation": "ACM managed renewal applies to certificates that are in use, meaning associated with an integrated service such as an ALB, CloudFront, or API Gateway, so an unassociated certificate is a common cause of a missed automatic renewal. For DNS-validated certificates, ACM re-validates by checking the CNAME records it issued, so deleting or altering those records in Route 53 breaks renewal; keeping them in place makes renewal fully automatic. ACM public certificate private keys cannot be exported, so option C describes an impossible action. Email validation requires a human to click a link every time and is therefore less reliable than DNS validation, not more. ACM public certificates have a fixed validity of about 13 months and the period cannot be extended, so option E is not possible."
 },
 {
  "id": "gen-b-39",
  "source": "authored",
  "domain": 3,
  "topic": "CloudWatch metrics for VPN and failover",
  "difficulty": "easy",
  "multi": false,
  "question": "A company uses AWS Site-to-Site VPN as a backup for a Direct Connect connection. The operations team wants an alarm that fires when either VPN tunnel drops so that the team can investigate before a failover event occurs.\n\nWhich solution will meet these requirements?",
  "choices": {
   "A": "Create a CloudWatch alarm on the TunnelState metric in the AWS/VPN namespace for each tunnel, alarming when the value is less than 1 for a sustained period.",
   "B": "Create a CloudWatch alarm on the TunnelDataIn metric in the AWS/VPN namespace, alarming when the value is greater than zero.",
   "C": "Create a CloudWatch alarm on the VirtualInterfaceBgpPeerState metric in the AWS/DX namespace filtered by the VPN connection ID.",
   "D": "Enable AWS Health notifications for the VPN connection and route them to Amazon SNS, since CloudWatch does not publish tunnel state."
  },
  "answer": [
   "A"
  ],
  "explanation": "Site-to-Site VPN publishes TunnelState to the AWS/VPN namespace with a dimension for each tunnel outside IP address, where 0 means down and 1 means up, so an alarm on a value below 1 detects a tunnel drop directly. Alarming on TunnelDataIn above zero would fire during normal operation and says nothing about tunnel health. VirtualInterfaceBgpPeerState is a Direct Connect metric and has no VPN connection dimension. AWS Health can surface maintenance events, but the premise in option D is false because CloudWatch does publish tunnel state, and Health events are not a substitute for a real-time state alarm."
 },
 {
  "id": "gen-b-40",
  "source": "authored",
  "domain": 4,
  "topic": "Layer 7 protection architecture",
  "difficulty": "hard",
  "multi": true,
  "question": "A public API is served by Amazon API Gateway with a regional endpoint. The security team must block requests from countries where the company does not operate, throttle abusive clients by API key, ensure that the API cannot be reached except through Amazon CloudFront, and keep the private key for the TLS certificate unexportable.\n\nWhich combination of actions will meet these requirements? (Select THREE.)",
  "choices": {
   "A": "Associate an AWS WAF web ACL with the API Gateway stage that contains a geographic match rule blocking the disallowed countries and a rate-based rule.",
   "B": "Use API Gateway usage plans with API keys to enforce per-client request rate and burst limits.",
   "C": "Attach a resource policy to the API that denies requests unless the aws:SourceVpce condition matches an interface endpoint in the CloudFront service account.",
   "D": "Have CloudFront add a secret custom header to origin requests, and attach an API Gateway resource policy or a WAF rule that denies requests without the correct header value.",
   "E": "Request a public certificate in AWS Certificate Manager for the custom domain name, since ACM public certificate private keys cannot be exported.",
   "F": "Enable mutual TLS on the API Gateway custom domain and upload the CloudFront origin private key to an Amazon S3 truststore."
  },
  "answer": [
   "A",
   "D",
   "E"
  ],
  "explanation": "An AWS WAF web ACL associated with the API Gateway stage supports geographic match statements to block requests by country and rate-based statements for coarse abuse control, satisfying the geo requirement. Because a regional API Gateway endpoint has no way to be restricted to CloudFront by network path, the standard control is a secret custom header injected by CloudFront and validated at the origin by a resource policy or WAF rule, which prevents direct access. ACM public certificates are fully managed and their private keys cannot be exported, so requesting one for the custom domain satisfies the key handling requirement. Option B is a plausible distractor for throttling, but usage plans require clients to send API keys and the question already covers abusive-client throttling through the WAF rate-based rule; more importantly the three required outcomes are geo blocking, CloudFront-only access, and unexportable keys. Option C is invalid because CloudFront does not reach a regional API through an interface VPC endpoint in the customer's account. Option F misstates mutual TLS, whose truststore holds CA certificates for validating client certificates and never a private key."
 }
];

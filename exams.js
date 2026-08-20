/* =============================================================================
   Exam registry — one entry per certification the app can drill.

   Each entry supplies everything that used to be a hardcoded constant in
   app.js: the domain-number -> name map used by the domain filter and the
   results breakdown, plus the three exam-simulation constants. Adding an exam
   means adding an entry here, shipping a questions-<id>.js bank that registers
   itself into window.QUESTION_BANKS, and adding both <script> tags to
   index.html. Nothing in app.js needs to change.

   `domains` keys must match the `domain` field on that bank's questions. A
   question whose domain is missing from the map still renders, but lands in
   an "Uncategorised" row on the results breakdown.
   ============================================================================= */
window.EXAMS = {
  'ans-c01': {
    id: 'ans-c01',
    code: 'ANS-C01',
    icon: '🌐',
    short: 'Advanced Networking',
    name: 'AWS Certified Advanced Networking – Specialty',
    blurb: 'Hybrid connectivity, VPC design, DNS, load balancing and network security.',
    passMark: 75,          // AWS scales to 750/1000; 75% is the usual proxy
    examMinutes: 170,
    examSize: 65,
    domains: {
      1: 'Network Design',
      2: 'Network Implementation',
      3: 'Network Management and Operation',
      4: 'Network Security, Compliance, and Governance'
    },
    credits: 'Community set from the Ditectrev ANS-C01 open practice repo plus ' +
      'originals written for this app.'
  },

  'dop-c02': {
    id: 'dop-c02',
    code: 'DOP-C02',
    icon: '🚀',
    short: 'DevOps Engineer',
    name: 'AWS Certified DevOps Engineer – Professional',
    blurb: 'CI/CD pipelines, infrastructure as code, resilience, observability ' +
      'and automated governance.',
    passMark: 75,          // AWS scales to 750/1000
    examMinutes: 180,
    examSize: 75,
    domains: {
      1: 'SDLC Automation',
      2: 'Configuration Management and IaC',
      3: 'Resilient Cloud Solutions',
      4: 'Monitoring and Logging',
      5: 'Incident and Event Response',
      6: 'Security and Compliance'
    },
    credits: 'Written for this app. No open community bank exists for DOP-C02, ' +
      'so every question here is original.'
  }
};

window.DEFAULT_EXAM = 'ans-c01';

import {
  explain,
  figLink,
  figureN,
  info,
  lesson,
  link,
  md,
  mermaid,
  tasks,
  tip,
  VID,
  yt,
  ytWatch,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaOpsNotes: Record<string, NoteDocument> = {
  "moshka-ops-learn": lesson({
    id: "moshka-ops-learn",
    name: "What you will learn",
    description:
      "Linux, Docker, AWS (S3, Lambda, CloudFront, CloudWatch), Azure, ngrok, here.now.",
    sections: [
      {
        id: "goal",
        title: "Where Harbor can live",
        blocks: [
          ...figureN(
            1,
            "aws-map",
            "moshka-aws-map.png",
            "AWS pieces",
            `S3 stores files, Lambda runs code, CloudFront serves fast. ${figLink(1, "aws-map")} is the map you will hear on calls.`
          ),
          md(
            "g",
            `TailoredTech hosting is not one cloud:

- Next.js on **Vercel** for some products
- Client **on-prem** sometimes
- **AWS** backend (Lambda, S3, CloudFront, ECR)
- **Azure** when the client already lives there
- Email: **SES** or **Graph**
- Files: Blob or S3`
          ),
          mermaid(
            "f",
            `flowchart TB
  N[Next app] --> V[Vercel]
  N --> Az[Azure]
  API[API / workers] --> AWS[AWS]
  AWS --> S3[S3 + CloudFront]
  AWS --> L[Lambda]
  AWS --> E[ECR]`,
            "Where Harbor can live",
            undefined,
            {
              N: "next-app",
              V: "vercel",
              Az: "azure",
              API: "api-workers",
              AWS: "aws",
              S3: "s3",
              L: "lambda",
              E: "ecr",
            }
          ),
          tasks("t", "Start", [{ id: "map", label: "You can point at Vercel vs AWS vs Azure on the diagram" }]),
        ],
      },
    ],
    explains: [
      explain(
        "next-app",
        "Next",
        "Next app",
        `The Harbor UI. Often on Vercel. Sometimes on a client box.`
      ),
      explain(
        "vercel",
        "Vercel",
        "Vercel",
        `Git push, preview URL, production. Fine for Next. Not every client allows it.`
      ),
      explain(
        "azure",
        "Azure",
        "Azure",
        `When the client already lives there. App Service, Blob, Graph email. Same product, their cloud.`
      ),
      explain(
        "api-workers",
        "API",
        "API / workers",
        `Routes, LangGraph jobs, file processing. Often AWS next to the Next app.`
      ),
      explain(
        "aws",
        "AWS",
        "AWS",
        `Lambda, S3, CloudFront, ECR, CloudWatch. Budget alarm before any toy server.`
      ),
      explain(
        "s3",
        "S3",
        "S3 + CloudFront",
        `Files in a bucket. CloudFront in front for public assets. Do not make a public bucket by accident.`
      ),
      explain(
        "lambda",
        "Lambda",
        "Lambda",
        `A function that runs, then stops. Good under 15 minutes. Long LangGraph jobs may need a container instead.`
      ),
      explain(
        "ecr",
        "ECR",
        "ECR",
        `A shelf of Docker images on AWS. Build, push, run.`
      ),
    ],
  }),
  "moshka-ops-linux": lesson({
    id: "moshka-ops-linux",
    name: "Linux without fear",
    description: "cd, ls, cat, chmod, logs. Enough to SSH and not panic.",
    sections: [
      {
        id: "do",
        title: "Five commands",
        blocks: [
          md(
            "m",
            `On a server you will also \`tail -f\` a log. That is CloudWatch's cousin.

Do this on your machine today. WSL is fine on Windows.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
pwd
ls
cd ~/Desktop/next-harbor
ls src
cat package.json
\`\`\`

Each command: print working directory, list files, change directory, list src, print package.json.`
          ),
          tasks("t", "Hands-on", [
            { id: "pwd", label: "You listed Harbor files from a terminal" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ops-account": lesson({
    id: "moshka-ops-account",
    name: "Cloud account and billing",
    description: "MFA on. Budget alarm first. Then any toy server.",
    sections: [
      {
        id: "do",
        title: "Before EC2",
        blocks: [
          md(
            "m",
            `AWS bills by surprise if you leave a box on.

1. MFA on the root user.
2. A budget alarm at a small number (talk to Abdelrahman for the shared account).
3. Do not make public S3 buckets unless you mean it.

Azure has Cost Management. Same habit.

You do not need to finish this alone. You do need to refuse to "just launch an instance" without a cap.`
          ),
          info(
            "bill",
            "Billing",
            "Set a budget alarm on day one. If you do not know how, stop and do that before EC2."
          ),
          tasks("t", "Hands-on", [
            { id: "alarm", label: "Billing alarm exists or you asked Abdelrahman to set it on a shared account" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ops-docker": lesson({
    id: "moshka-ops-docker",
    name: "Docker words",
    description: "Dockerfile is a recipe. Image is the snapshot. Container is it running.",
    sections: [
      {
        id: "do",
        title: "Recipe",
        blocks: [
          yt(
            "v",
            VID.docker,
            "Docker in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2 minutes."
          ),
          ytWatch(
            "v-long",
            VID.dockerNana,
            "Docker tutorial (TechWorld with Nana)",
            "0:00",
            "35:00",
            "Images vs containers, then a first Dockerfile. Stop at 35:00. The full video is hours."
          ),
          md(
            "m",
            `- **build** makes an image
- **run** starts a container
- **ECR** is AWS's shelf of images

You already ran a Postgres container in SQL Harbor. That was Docker.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
docker ps
\`\`\`

If \`harbor-pg\` is still there, you are looking at a container. \`docker images\` lists snapshots.`
          ),
          link("d", "https://docs.docker.com/get-started/", "Docker get started", "Official."),
          tasks("t", "Hands-on", [
            { id: "words", label: "You can say image vs container" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ops-dockerfile": lesson({
    id: "moshka-ops-dockerfile",
    name: "A real Dockerfile",
    description: "FROM, COPY, CMD. You may not push today. You write the file.",
    sections: [
      {
        id: "do",
        title: "Node image",
        blocks: [
          md(
            "m",
            `This is a simple recipe for a Node app. Next.js production Docker is more picky (standalone output). This file is to learn the words, not to ship Bahri.`
          ),
          md(
            "p",
            `\`Dockerfile\` in Next Harbor:

\`\`\`dockerfile:Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
\`\`\`

Do not copy \`.env.local\` into the image.`
          ),
          md(
            "term",
            `Run this in the terminal if you want to try a build (optional, can be slow):

\`\`\`bash
cd ~/Desktop/next-harbor
docker build -t harbor-web .
\`\`\`

You do not need to push to ECR today. Write in README: FROM, COPY, CMD in your own words.`
          ),
          tasks("t", "Hands-on", [
            { id: "file", label: "Dockerfile exists" },
            { id: "readme", label: "README explains image vs container in your words" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ops-aws": lesson({
    id: "moshka-ops-aws",
    name: "AWS the TailoredTech way",
    description: "Account, billing alarm, S3, CloudFront, Lambda, ECR, CloudWatch, autoscaling.",
    sections: [
      {
        id: "do",
        title: "The short map",
        blocks: [
          md(
            "m",
            `**S3:** files. Screenshots, PDFs, zips.

**CloudFront:** CDN in front of S3 so Egypt is not slow.

**Lambda:** small API, under 15 minutes.

**API Gateway or Function URL:** how the world hits Lambda.

**ECR:** Docker images for longer workers.

**CloudWatch:** logs and alarms. Error tracking starts here, plus a product like Sentry if the client pays.

**Autoscaling:** more boxes when CPU is high. Lambda kind of does this for you. ECS/EC2 you configure.

**EC2:** a Linux computer you SSH into. Use it when a container platform is too much, not as a default.

**Triggers:** S3 upload can fire a Lambda. That is how "user uploaded a PDF, now extract text" works.`
          ),
          link(
            "s3",
            "https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html",
            "S3 getting started",
            "Official. Create a bucket. Upload one file. Do not make it public unless you mean it."
          ),
          tasks("t", "Hands-on", [
            { id: "s3", label: "You uploaded one file to S3 or watched Abdelrahman do it" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ops-azure": lesson({
    id: "moshka-ops-azure",
    name: "Azure when the client lives there",
    description: "App Service or Container Apps, Blob, Graph email, Entra ID.",
    sections: [
      {
        id: "do",
        title: "Same ideas, different names",
        blocks: [
          md(
            "m",
            `If Bahri (or another client) is already on Azure, we go there.

- **Blob** ≈ S3
- **App Service / Container Apps** ≈ where Next can run
- **Microsoft Graph** ≈ email, like SES
- **Entra ID** ≈ company login

You do not memorize the portal. You map the AWS idea to the Azure name.`
          ),
          link(
            "az",
            "https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs",
            "Azure App Service Node quickstart",
            "Official. Skim even if you do not deploy."
          ),
          tasks("t", "Check", [
            { id: "map", label: "You mapped S3 to Blob and SES to Graph" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ops-observe": lesson({
    id: "moshka-ops-observe",
    name: "Logs, errors, autoscaling",
    description: "If it fails at 2am, a log must exist.",
    sections: [
      {
        id: "do",
        title: "See it break",
        blocks: [
          md(
            "m",
            `Log the request id. Log the tenant id. Never log passwords.

CloudWatch (AWS) or App Insights (Azure). Plus an error product if the client wants screenshots of crashes.

Autoscaling is useless if you cannot tell CPU from a bug loop.

In Harbor POST, add:

\`\`\`ts
console.log("logs.insert", { tenantId, length: text.length })
\`\`\`

Not the full text if it might be sensitive. Not the cookie.`
          ),
          tasks("t", "Hands-on", [
            { id: "log", label: "Harbor API logs one line per POST with no secrets" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ops-tools": lesson({
    id: "moshka-ops-tools",
    name: "ngrok and here.now",
    description: "Show a local app. Publish a tiny static thing fast.",
    sections: [
      {
        id: "do",
        title: "Two tunnels to the world",
        blocks: [
          link("ngrok", "https://ngrok.com/docs/getting-started/", "ngrok getting started", "Share localhost with Abdelrahman."),
          link("here", "https://here.now", "here.now", "Publish a static page in seconds. Good for a cafe screenshot site."),
          md(
            "m",
            `**ngrok:** Harbor is on localhost. Client wants to tap it on a phone. Tunnel.

**here.now:** throw a folder on the internet without a full AWS story.

Use them as tools. They are not production for Bahri.`
          ),
          md(
            "term",
            `After ngrok is installed, run this in the terminal (dev server on 3000):

\`\`\`bash
ngrok http 3000
\`\`\`

It prints a public URL. Send that, not localhost.`
          ),
          tip("n", "Next", "BBS tour: the real enterprise repo."),
          tasks("t", "Hands-on", [
            { id: "try", label: "You read both getting started pages" },
          ]),
        ],
      },
    ],
  }),
}

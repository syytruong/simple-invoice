# Simple Invoice
## Structure
```
simple-invoice/
├── node_modules/
├── public/
│   ├── index.html
├── src/
│   ├── assets/
│   │   ├── logo.svg
│   ├── constant/
│   │   ├── index.ts
│   │   ├── style.ts
│   ├── pages/
│   │   ├── Invoice
│   │   │   ├── CreateInvoice.tsx
│   │   │   ├── index.tsx
│   │   │   ├── interfaces.ts
│   │   │   └── InvoiceList.tsx
│   │   ├── Login
│   │   │   ├── index.tsx
│   │   └── index.tsx
│   ├── services/
│   │   ├── authService.js
│   ├── styles/
│   │   ├── index.css
│   ├── utils/
│   │   ├── request.ts
│   ├── index.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
```

## Setting up

### Step 1

### Step 1: setup computer

[Show hidden file on mac](https://nordlocker.com/blog/how-to-show-hidden-files-mac)


[Install nvm](https://medium.com/devops-techable/how-to-install-nvm-node-version-manager-on-macos-with-homebrew-1bc10626181)

[Install node and npm (latest version)](https://medium.com/@lucaskay/install-node-and-npm-using-nvm-in-mac-or-linux-ubuntu-f0c85153e173)

Install git (default in Mac)

Install code editor: visual studio code

### Step 2: Run app locally

Getting started and running the app locally
```
nvm use 14.18.1 # current node version that is working with our serve
npm install # run this if you have not installed
npm run dev # compiles and hot-reloads for development
npm run test # run test
```

Enjoy!
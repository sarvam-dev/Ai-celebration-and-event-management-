# Use an official Node image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy configuration files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all other project source files
COPY . .

# Build your Vite frontend (if applicable)
RUN npm run build --if-present

# Expose port 7860 (Hugging Face default)
EXPOSE 7860
ENV PORT=7860

# Start your backend server (adjust if using another file or script)
CMD ["node", "server.js"]

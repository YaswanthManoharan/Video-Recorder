# Video Recorder

A versatile video recording application that supports video recording, screen recording (with or without system audio), and the ability to record with or without video. This project is built with React.js, Vite, Tailwind CSS, and TypeScript.

## Deployed Application

Access the deployed application here: [Video Recorder](https://video-recorder-self.vercel.app/)

## Demo Username and Password
Username: admin
Password: admin

## Features

- **Video Recording**: Record videos using your webcam.
- **Screen Recording**: Capture your screen with options to include system audio.
- **Customizable Recording Modes**: 
  - Screen recording with or without system audio.
  - Video recording with or without video input (audio-only mode).

## Getting Started

Follow these steps to run the app locally.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version 16 or higher recommended)
- **npm** or **yarn** (package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YaswanthManoharan/Video-Recorder.git
   cd Video-Recorder/Recorder
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

### Running the App

1. Start the development server:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:5173`.

## How to Use the App

### 1. **Video Recording**
   - **Steps**:
     1. Select the **Video Recording** option.
     2. Allow camera and microphone permissions when prompted.
     3. Click the **Start Recording** button to begin.
     4. Click **Stop Recording** when finished.
     5. Review your recording and download if desired.

### 2. **Screen Recording**
   - **Steps**:
     1. Select the **Screen Recording** option.
     2. Choose whether to include external audio.
     3. Select the screen or application window to record / include system audio in the pop up if needed.
     4. Click the **Start Recording** button to begin.
     5. Click **Stop Recording** when finished.
     6. Review your recording and download if desired.

### 3. **Customizable Recording Modes**
   - **Screen Recording without Video Input**:
     - Use this mode for audio-only recording.
     - Ensure externak audio is enabled but video is disabled in the checkbox.
   - **Screen Recording without System Audio**:
     - Choose not to include system audio during screen recording.

## Technologies Used

- **React.js** + **Vite**: For building the user interface.
- **TypeScript**: For type safety and better developer experience.
- **Tailwind CSS**: For styling the application.
- **MediaRecorder API**: For recording functionalities.

## Contribution

Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Let me know if you'd like to tweak or expand any section.

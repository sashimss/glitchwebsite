import http.server
import socketserver
import webbrowser
import os
import subprocess
import argparse

# ========== SETTINGS ==========
UNITY_PATH = r"C:\Program Files\Unity\Hub\Editor\2022.3.0f1\Editor\Unity.exe"  # change this
PROJECT_PATH = r"C:\Users\YourName\Documents\UnityProjects\MyGame"             # change this
BUILD_PATH = os.path.join(PROJECT_PATH, "Builds", "WebGL")                     # your WebGL build folder
BUILD_METHOD = "MyGame.EditorBuild.PerformWebGLBuild"                          # optional: your custom build method
PORT = 8000
# ==============================

def build_unity():
    """Optionally trigger Unity build (headless)"""
    print("🚧 Building Unity WebGL project...")
    subprocess.run([
        UNITY_PATH,
        "-batchmode",
        "-quit",
        "-projectPath", PROJECT_PATH,
        "-executeMethod", BUILD_METHOD,
        "-logFile", os.path.join(PROJECT_PATH, "webgl_build.log")
    ], check=True)
    print("✅ Build completed!")


def run_server():
    """Start a simple HTTP server for the WebGL build"""
    os.chdir(BUILD_PATH)

    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"🌐 Serving WebGL build at: {url}")
        webbrowser.open(url)
        print("Press Ctrl+C to stop the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped.")


def main():
    parser = argparse.ArgumentParser(description="Run Unity WebGL build locally")
    parser.add_argument("--build", action="store_true", help="Build Unity project before running server")
    args = parser.parse_args()

    if args.build:
        build_unity()

    if not os.path.exists(BUILD_PATH):
        print(f"❌ Build path not found: {BUILD_PATH}")
        return

    run_server()


if __name__ == "__main__":
    main()

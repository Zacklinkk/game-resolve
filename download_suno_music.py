"""
Download music from Suno using Selenium
"""
import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Target directory
DOWNLOAD_DIR = r"C:\A_AI_NEW\game-resolve\art\music"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument(f"--download-default-directory={DOWNLOAD_DIR}")
prefs = {
    "download.default_directory": DOWNLOAD_DIR,
    "download.prompt_for_download": False,
    "directory_upgrade": True,
    "safebrowsing.enabled": True
}
chrome_options.add_experimental_option("prefs", prefs)

# Initialize driver
driver = webdriver.Chrome(options=chrome_options)

try:
    print("Navigating to Suno...")
    driver.get("https://suno.com/me")

    # Wait for user to login manually
    print("\n" + "="*60)
    print("Please login to Suno in the browser window that opened.")
    print("After logging in and seeing your library, press Enter here...")
    print("="*60)
    input()

    # Refresh to get logged-in state
    driver.refresh()
    time.sleep(3)

    # Find all music tracks
    print("\nLooking for music tracks...")
    wait = WebDriverWait(driver, 10)

    # Try to find library items
    # The library items may have different selectors, let's try a few
    possible_selectors = [
        "a[href*='/library/']",
        "[class*='library']",
        "[class*='track']",
        "[class*='song']",
    ]

    tracks = []
    for selector in possible_selectors:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
            if elements:
                print(f"Found {len(elements)} elements with selector: {selector}")
                tracks = elements
                break
        except:
            continue

    if not tracks:
        print("Trying to get page source for analysis...")
        page_source = driver.page_source
        print("Page length:", len(page_source))

        # Save page source for debugging
        with open(os.path.join(DOWNLOAD_DIR, "page_source.html"), "w", encoding="utf-8") as f:
            f.write(page_source)
        print(f"Page source saved to {os.path.join(DOWNLOAD_DIR, 'page_source.html')}")

        # Look for download buttons directly
        print("\nSearching for download buttons...")
        download_selectors = [
            "button[download]",
            "a[download]",
            "[class*='download']",
            "button:contains('download')",
        }

        for dl_selector in download_selectors:
            try:
                download_btns = driver.find_elements(By.CSS_SELECTOR, dl_selector)
                if download_btns:
                    print(f"Found {len(download_btns)} download buttons with selector: {dl_selector}")
            except:
                pass

    # Click download buttons
    print("\nAttempting to download music...")
    downloaded_count = 0

    # Look for buttons containing "download" text
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    # Wait for page to fully load
    time.sleep(5)

    # Get all buttons
    all_buttons = driver.find_elements(By.TAG_NAME, "button")
    print(f"Found {len(all_buttons)} buttons on page")

    # Find and click download buttons
    for i, btn in enumerate(all_buttons):
        try:
            text = btn.text.lower()
            if 'download' in text or 'mp3' in text:
                print(f"Found download button: {btn.text}")
                print(f"  Button attributes: {btn.get_attribute('outerHTML')[:200]}")

                # Scroll to button
                driver.execute_script("arguments[0].scrollIntoView(true);", btn)
                time.sleep(0.5)

                # Click
                try:
                    btn.click()
                    downloaded_count += 1
                    print(f"  ✓ Clicked download button {downloaded_count}")
                    time.sleep(2)  # Wait for download to start
                except Exception as e:
                    print(f"  ✗ Error clicking: {e}")
        except Exception as e:
            continue

    print(f"\nDownloaded {downloaded_count} files")
    print(f"Files should be in: {DOWNLOAD_DIR}")

    # List downloaded files
    files = os.listdir(DOWNLOAD_DIR)
    mp3_files = [f for f in files if f.endswith('.mp3')]
    print(f"MP3 files in directory: {len(mp3_files)}")
    for f in mp3_files:
        print(f"  - {f}")

    print("\nPress Enter to close browser...")
    input()

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    print("\nPress Enter to close browser...")
    input()

finally:
    driver.quit()
    print("Browser closed.")

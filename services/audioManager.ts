/**
 * Audio Manager Service
 * Handles background music and sound effects for the game
 */

export type MusicTrack = 'menu' | 'gameplay' | 'tension' | 'ending';

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: MusicTrack | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.4;

  // Music track URLs
  private tracks: Record<MusicTrack, string> = {
    menu: '/audio/menu_music.mp3',
    gameplay: '/audio/01-dark-military-industrial.mp3',
    tension: '/audio/02-shadow-protocol.mp3',
    ending: '/audio/01-dark-military-industrial.mp3'
  };

  /**
   * Play a music track
   */
  play(track: MusicTrack, loop: boolean = true): void {
    // Stop current track if playing
    if (this.audio && this.currentTrack !== track) {
      this.stop();
    }

    // If same track is already playing, just return
    if (this.currentTrack === track && this.isPlaying) {
      return;
    }

    try {
      this.audio = new Audio(this.tracks[track]);
      this.audio.loop = loop;
      this.audio.volume = this.volume;

      // Play the audio
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.currentTrack = track;
      }).catch(error => {
        console.warn('Audio play failed:', error);
        // User might not have interacted with the document yet
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  /**
   * Stop the current track
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.currentTrack = null;
    }
  }

  /**
   * Pause the current track
   */
  pause(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  /**
   * Resume the current track
   */
  resume(): void {
    if (this.audio && !this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.warn('Audio resume failed:', error);
      });
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  /**
   * Fade out the current track
   */
  fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audio || !this.isPlaying) {
        resolve();
        return;
      }

      const startVolume = this.audio.volume;
      const startTime = Date.now();

      const fade = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newVolume = startVolume * (1 - progress);

        if (this.audio) {
          this.audio.volume = Math.max(0, newVolume);
        }

        if (progress < 1) {
          requestAnimationFrame(fade);
        } else {
          this.stop();
          // Restore original volume for next play
          if (this.audio) {
            this.audio.volume = this.volume;
          }
          resolve();
        }
      };

      fade();
    });
  }

  /**
   * Fade in a new track
   */
  fadeIn(track: MusicTrack, duration: number = 1000, loop: boolean = true): void {
    this.play(track, loop);

    if (this.audio) {
      const startVolume = 0;
      const targetVolume = this.volume;
      const startTime = Date.now();

      this.audio.volume = startVolume;

      const fade = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newVolume = startVolume + (targetVolume - startVolume) * progress;

        if (this.audio) {
          this.audio.volume = Math.min(targetVolume, newVolume);
        }

        if (progress < 1) {
          requestAnimationFrame(fade);
        }
      };

      fade();
    }
  }

  /**
   * Check if audio is currently playing
   */
  isPlayingNow(): boolean {
    return this.isPlaying;
  }

  /**
   * Get the current track
   */
  getCurrentTrack(): MusicTrack | null {
    return this.currentTrack;
  }

  /**
   * Play a click sound effect (optional enhancement)
   */
  playClick(): void {
    // You can add a short click sound here
    // const click = new Audio('/audio/click.mp3');
    // click.volume = this.volume * 0.5;
    // click.play().catch(() => {});
  }
}

// Export a singleton instance
export const audioManager = new AudioManager();

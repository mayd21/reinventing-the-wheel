/**
 * 适配器模式
 * 作为两个不兼容接口之间的桥梁
 */
// Media 接口
class MediaPlayer {
  play(audioType, filename) {
    throw new Error("子类请实现接口");
  }
}
// Advanced Media 接口
class AdvancedMediaPlayer {
  playVlc(filename) {
    throw new Error("子类请实现接口");
  }
  playMp4(filename) {
    throw new Error("子类请实现接口");
  }
}

class VlcPlayer extends AdvancedMediaPlayer {
  playVlc(filename) {
    console.log(`Playing vlc file. Name: ${filename}`);
  }
  playMp4() {
    return;
  }
}
class Mp4Player extends AdvancedMediaPlayer {
  playMp4(filename) {
    console.log(`Playing mp4 file. Name: ${filename}`);
  }
  playVlc() {
    return;
  }
}

// Media Player 适配器
class MediaPlayerAdapter extends MediaPlayer {
  constructor(audioType) {
    super();
    if (audioType === "vlc") {
      this.advancedMusicPlayer = new VlcPlayer();
    } else if (audioType === "mp4") {
      this.advancedMusicPlayer = new Mp4Player();
    }
  }
  play(audioType, filename) {
    if (audioType === "vlc") {
      this.advancedMusicPlayer.playVlc(filename);
    } else if (audioType === "mp4") {
      this.advancedMusicPlayer.playMp4(filename);
    }
  }
}

class AudioPlayer extends MediaPlayer {
  mediaAdapter = null;
  play(audioType, filename) {
    switch (audioType) {
      case "mp3":
        console.log(`Playing mp3 file. Name: ${filename}`);
        break;
      case "vlc":
      case "mp4":
        this.mediaAdapter = new MediaPlayerAdapter(audioType);
        this.mediaAdapter.play(audioType, filename);
        break;
      default:
        console.log("Invalid media");
    }
  }
}
// test
const audioPlayer = new AudioPlayer();
audioPlayer.play("mp3", "a.mp3");
audioPlayer.play("mp4", "b.mp4");
audioPlayer.play("vlc", "c.vlc");

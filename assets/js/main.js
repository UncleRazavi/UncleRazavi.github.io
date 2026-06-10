---
layout: default
title: Hossein Razavi | Home
---

<div id="particles-js" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:-1;"></div>

<!-- HERO -->
<section class="hero win98-window" id="welcome-section">

    <div class="window-title">Welcome to Hossein's Page</div>

    <div class="window-content" style="text-align:center;">

        <div id="avatar-3d" style="width:150px; height:150px; margin:20px auto;"></div>

        <h1 id="typewriter">Hello! I'm Hossein Razavi</h1>

        <a href="about.html" class="win98-button primary">
            Learn More About My Journey
        </a>

    </div>
</section>

<main class="container">

    <!-- SIGNAL LAB -->
    <section class="signal-lab win98-window">
        <div class="window-title">Signal Processing Lab</div>

        <div class="window-content"
             style="display:flex;flex-wrap:wrap;gap:30px;justify-content:center;align-items:flex-start;">

            <div style="text-align:center;">
                <p>Oscilloscope</p>
                <canvas id="signalCanvas" width="320" height="140"></canvas>
            </div>

            <div style="text-align:center;">
                <p>Lorenz Attractor</p>
                <canvas id="lorenzCanvas" width="320" height="200"></canvas>
            </div>

        </div>
    </section>

    <!-- DSP LAB -->
    <section class="dsp-lab win98-window">
        <div class="window-title">Interactive DSP Lab</div>

        <div class="window-content">

            <div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;">
                <div>
                    <p>Signal</p>
                    <canvas id="scopeCanvas" width="320" height="140"></canvas>
                </div>

                <div>
                    <p>FFT Spectrum</p>
                    <canvas id="fftCanvas" width="320" height="140"></canvas>
                </div>
            </div>

            <div style="margin-top:15px;text-align:center;">
                <label>Frequency <input type="range" id="freqSlider" min="1" max="20" value="5"></label>
                <label>Noise <input type="range" id="noiseSlider" min="0" max="1" step="0.01" value="0"></label>
                <label>Band Pass <input type="range" id="filterSlider" min="1" max="20" value="5"></label>
            </div>

        </div>
    </section>

    <!-- AUDIO -->
    <section class="audio-lab win98-window">
        <div class="window-title">Microphone Analyzer</div>

        <div class="window-content" style="text-align:center;">
            <p>Microphone FFT</p>
            <canvas id="micFFT" width="420" height="150"></canvas>

            <p>Spectrogram</p>
            <canvas id="spectrogram" width="420" height="180"></canvas>
        </div>
    </section>

    <!-- FILTER -->
    <section class="filter-lab win98-window">
        <div class="window-title">Filter Designer</div>

        <div class="window-content" style="text-align:center;">
            <canvas id="bodeCanvas" width="420" height="200"></canvas>

            <div style="margin-top:15px;">
                <label>Cutoff <input type="range" id="cutoffSlider" min="1" max="100" value="20"></label>

                <label>
                    Type
                    <select id="filterType">
                        <option value="lowpass">Low Pass</option>
                        <option value="highpass">High Pass</option>
                    </select>
                </label>
            </div>
        </div>
    </section>

    <!-- CURVES -->
    <section class="math-curves win98-window">
        <div class="window-title">Mathematical Curves</div>

        <div class="window-content" style="display:flex;gap:10px;flex-wrap:wrap;">
            <canvas id="lissajous-canvas"></canvas>
            <canvas id="rose-canvas"></canvas>
            <canvas id="butterfly-canvas"></canvas>
            <canvas id="spirograph-canvas"></canvas>
        </div>
    </section>

    <!-- FRACTAL -->
    <section class="fractal-section win98-window" id="fractalWindow">

        <div class="window-title">Static Mandelbrot</div>

        <div class="window-content"
             style="text-align:center;display:flex;justify-content:center;align-items:center;">

            <canvas id="fractalCanvas" width="300" height="220"
                style="border:2px solid #808080;"></canvas>

        </div>
    </section>

    <!-- BLOG -->
    <section class="latest-blog win98-window">
        <div class="window-title">Latest Blog Posts</div>

        <div class="window-content">

            <ul style="list-style:none;padding:0;">
                {% for post in site.posts limit:3 %}
                <li style="margin-bottom:15px;padding:10px;" class="win98-bevel-out">
                    <h3>
                        <a href="{{ post.url }}">{{ post.title }}</a>
                    </h3>

                    <p>
                        <time datetime="{{ post.date | date_to_xmlschema }}">
                            {{ post.date | date: "%B %d, %Y" }}
                        </time>
                    </p>

                    <p>{{ post.excerpt | strip_html | truncatewords:25 }}</p>

                    <a href="{{ post.url }}" class="win98-button">Read Post →</a>
                </li>
                {% endfor %}
            </ul>

            <div style="text-align:right;margin-top:15px;">
                <a href="blog.html" class="win98-button">View All</a>
            </div>

        </div>
    </section>

    <!-- ABOUT + CONTACT -->
    <section class="grid-layout-secondary">

        <section class="about-preview win98-window">
            <div class="window-title">About Me</div>

            <div class="window-content">
                <p>
                    I study electrical engineering with interest in
                    signal processing, neuroscience, and data science.
                </p>

                <div style="text-align:center;margin-top:15px;">
                    <a href="about.html" class="win98-button">Full Bio</a>
                </div>
            </div>
        </section>

        <section class="contact-preview win98-window">
            <div class="window-title">Contact</div>

            <div class="window-content" style="text-align:center;">
                <p>Questions or collaboration ideas are always welcome.</p>

                <a href="contact.html" class="win98-button primary">
                    Contact Me
                </a>
            </div>
        </section>

    </section>

</main>

<!-- TASKBAR (must be outside main) -->
<div class="taskbar">
    <div class="start-button">Start</div>

    <div class="taskbar-apps">
        <div class="task-item">Home</div>
        <div class="task-item">DSP Lab</div>
        <div class="task-item">Fractals</div>
    </div>

    <div class="clock" id="clock">00:00</div>
</div>

<!-- UI BUTTONS -->
<button id="scrollTopBtn" class="win98-button"
style="position:fixed;bottom:20px;right:20px;display:none;">
↑ Top
</button>

<button id="dark-mode-toggle" style="display:none;">
Toggle Dark Mode
</button>

<!-- SCRIPTS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r150/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
<script src="/assets/js/main.js"></script>

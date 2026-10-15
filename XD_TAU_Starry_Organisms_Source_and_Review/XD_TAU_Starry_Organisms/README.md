# XD-TAU / Starry Organisms

**A proposed application profile of Tom Klootwijk’s XD-TAU v1.5.**

This package is a working first demonstrator and an architectural starting point, not a complete implementation of the 71-page specification. The original paradigm is attributed to Tom Klootwijk; this application implementation and its proposed extensions are AI-assisted.

## Run the visual demonstrator

Open `XD_TAU_Starry_Organisms.html` in a modern desktop browser. It is one self-contained HTML file: no installation, CDN, server dependency, wallet, mining, or network calls. A browser or organization that blocks local HTML files may require a local HTTP server instead:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000/XD_TAU_Starry_Organisms.html` locally. The included `build_html.py` recreates that HTML file from `template.html`, `organism_core.js`, and `ui.js`.

Start with the synthetic night-field. **Load photo** reads your image on your machine. **Feed +12** supplies precursor with an explicit amount/energy ledger. **Toggle allele** changes a recorded production-rate allele without changing entity identity. **Membrane** displays a selected local shell; **3D portrait** and **2D chart** are artistic observations. Drag the 3D canvas to orbit. The timeline replays from genesis and recorded events.

**Save state** preserves exact normalized RGB8 pixels, the finite model state, source-byte digest when available, public art seed, profile, geometry program, tagged operations, and checkpoint hash. **Load state** checks the digest and replays the state in the current runtime. **Save painted PNG** exports only a picture, not the evolving organism.

Do not enter wallet recovery words or private keys in the public art seed field. No personal identifier or birth date is required or embedded by this application. The original photo bytes are not included in exported checkpoints, although a low-resolution representation of the photo is; treat checkpoints as potentially private image data.

## What is actually implemented

The model has 32 independently supplied membrane reactors indexed by the document’s owned equal-area spherical cells. It uses positive exponential pair exchange, ordered catalytic reaction subflows, dissolved-to-shell deposition, and a chemical/thermal energy ledger. Shell inventory changes the stored sphere-difference geometry and the next tick’s precursor conductance. The state is described through `E, H, P, xi, b, F, O, C`.

The image has two separate roles: its canonical pixels participate in the SHA-256 genesis, and its sampled lightness drives initial precursor/reservoir data while its colors inform the brush renderer. A hash alone is not treated as a perception model.

This is **not** a native Windows executable, a Unity build, an HDR framebuffer renderer, a 3D/4D file importer, a trained neural model, a blockchain, or a claim of biological life. The 3D portrait is a projected painterly field, not a volumetric ray marcher. There is no physical scattering/fluid solver in this application. The real simulation clocks and the visual glow remain separate.

## Headless execution and testing

The optional command-line runner uses Node.js, with no third-party npm packages:

```sh
node organism_cli.js --seed "starry starry night" --ticks 1200 --out checkpoint.json
node organism_cli.js --input checkpoint.json --ticks 100 --out later.json
node organism_cli.js --verify checkpoint.json
node test_core.js
```

Existing output files are protected unless `--overwrite` is supplied. `--ticks` means additional ticks after an input checkpoint. The command-line runner is source code requiring Node, not a compiled native executable.

`demo_test_results.json` records 24 passing finite test groups, including SHA-256 comparisons against Node’s crypto implementation, repeatable genesis, input sensitivity, equal-area lookup, event convergence, distinct-tag XOR behavior, replay, source accounting, positivity, and checkpoint tamper detection. Passing these finite tests is not a general convergence theorem or a cross-device rendering guarantee.

The UI was exercised in headless Chromium from in-memory HTML. Direct file navigation was blocked by the test environment’s browser policy, so a `file://` launch was not verified in that environment. The HTML itself has no external resource dependencies. See `browser_test_results.json` for actual UI checks and scope.

## Architectural source and verification

Source PDF: **Tom Klootwijk — XD-TAU: An Integrated Architecture of Geometry, Physics and Information, v1.5, 13 October 2026**, 71 pages.

PDF SHA-256:

```text
8dfae654435c035beefc3f9770cf6f51b55c0cef968071900142e4cf9b1cf0fd
```

The PDF has 18 embedded files, including eight Python verification scripts. All eight were extracted and independently rerun successfully in this environment. `architecture_rerun_report.json` records the environment, exact script hashes, stdout, and scope. Selected newly generated JSON results are under `architecture_verification/`. The user’s original PDF is not duplicated in this package; its embedded scripts remain in that source PDF.

The rerun verifies those finite checks, not every theorem independently, general 3D/4D engine performance, physical experiments, legal status, or scientific novelty. Floating-point residuals may differ from the PDF’s recorded environment.

## Files worth reading

- `PROFILE.md`: implemented state, equations, causal order, units, and limits.
- `ARCHITECTURE_AND_ROADMAP.md`: source-grounded design and proposed input/format/native-runtime expansion.
- `source_map.json`: machine-readable links between implementation modules and the PDF’s pages/equations.
- `references.json`: external primary documentation checked for the proposed Unity/format/hash adapters.
- `example_checkpoint_n1200.json`: a reproducible example from the headless core.
- `artifact_manifest.json`: SHA-256 file manifest for this delivered package; it excludes itself to avoid self-hash recursion.

The package manifest binds the delivered code bytes. The demo genesis binds the declared profile/version and source pixels; it does not itself include a digest of its executing JavaScript source. A production capsule should bind its independently stored runtime module digest explicitly.

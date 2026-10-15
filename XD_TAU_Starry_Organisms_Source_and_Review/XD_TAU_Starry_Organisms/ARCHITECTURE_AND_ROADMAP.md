# From XD-TAU to portable digital organisms

## Design thesis

**Preserve what an organism is, how it changes, and why a visible state occurred—not just its rendered mesh or video.**

The supplied architecture supports that direction through stable identity, distinct spatial and interaction relations, authoritative geometry programs, evolving fields, typed couplings, numerical semantics, and replayable operations. The following larger product/format design is proposed, not already implemented by the source PDF or this browser preview.

## Use the architecture to specify the application

A profile should describe itself using the document’s own composition requirements: finite state, operators, coefficients, units/frames, initial and boundary/source data, event schedule, stage order, clocks, numerical encoding, ledgers, and tested invariants (PDF p. 52). Every new effect needs an input/output contract rather than an analogy.

The source document can itself be catalogued as stable entities for pages, equations, profiles, source modules, tests, and evidence records. Organizational links, spatial/display grouping, and mathematical dependencies remain separate relations. `source_map.json` begins that catalog for the implemented subset; it does not claim to automatically compile natural-language mathematics into a verified solver.

## Separate the photograph’s identity from its meaning

An immutable source digest identifies bytes. A canonical-content digest identifies a declared decoded representation. Neither substitutes for image analysis. A second lane retains measurable or selected image features: color, silhouettes, edges, depth evidence, segmentation masks, and source-specific confidence.

Suggested mappings: palette to pigment, edges to brush directions, segmentation to body compartments, confidence to fitting weights, and an artist-controlled map from lightness to supplied nutrients. A physical irradiance adapter needs actual radiometric units/calibration, rather than reinterpreting display RGB as watts.

## Input dimensionality is a typed declaration

- **2D:** images, paintings, drawings, masks. A heightfield or extrusion is a declared generative lifting, not recovered hidden geometry. A multi-view reconstruction is a different adapter with its own evidence and error model.
- **3D:** meshes, point clouds, implicit programs, sampled density/material fields. Store frames, scale, sample layout, field types, and boundary interpretation. A non-watertight mesh or unsigned cloud does not automatically determine an inside/outside region.
- **3D plus time:** volumes or geometry sampled at recorded epochs. Retain stable IDs, changing topology, interpolation/activation rules, physical time, and optional log-time navigation.
- **Four spatial coordinates:** `Phi(x,y,z,w)` needs a separately declared 4D manifold, metric, operators, and slice/projection adapter. The document’s ADM 3+1 module is not automatically an arbitrary Euclidean 4D solid engine.

The browser preview imports only images. Its simulation timeline is not a 4D dataset importer.

## Visual profile: painterly form plus neon light

Aim for curved, layered brush marks, visible stroke direction and scale, blue/cyan atmosphere, amber star nuclei, dark negative space, shaded shells, and selective glow. Bloom alone is not the painterly style.

Source-native operators provide useful candidates. The Shark–Geyser chain and retained unwrapped phase can drive reproducible brush coordinates (PDF pp. 50–51). Scale-periodic log-sine fields can modulate banding. The graph-to-axis adapter can orient growth. Shiitake envelopes can visualize a solved plume state, and the Klein offset can supply folded sheet geometry. Each retains the distinction between an artistic display transform and a physical constitutive law.

## A proposed Unity/native architecture

Keep an authoritative deterministic kernel independent of Unity’s rendering state. The kernel advances the declared profile and exposes typed buffers for positions, local fields, normals/tangents, stable entity indices, colors, and other render observations.

A Unity adapter would upload structured buffers, bind them with `VisualEffect.SetGraphicsBuffer`, and read them through VFX Graph’s Sample Graphics Buffer operator. Build the effect through Spawn, Initialize, Update, and Output contexts. Fix the visual random seed with reseeding disabled. Avoid treating that renderer seed as a guarantee of identical physical trajectories or identical pixels across GPUs.

For an HDRP desktop prototype, use linear/HDR working color, shaded geometry or brush ribbons, emissive highlights, atmospheric effects where supported, and deliberate bloom/tone mapping. VFX Graph has compute-shader and render-pipeline requirements; exact target versions and platforms should be pinned. A separate browser renderer can consume the same semantic state without claiming Unity Web deployment parity.

First native milestone: photo import, saved specimen, deterministic timeline, isolated authoritative kernel, read-only VFX buffers, and state/preview export. Later milestones: mesh/volume input, time-varying volume ingestion, genuine graph transport/learning adapters, safe structured mutations, and lineage collaboration. No native binary or Unity project is included in this delivery.

## Proposed capsule format, not a new mandatory replacement for existing formats

A `.xdtau` capsule could contain:

```text
manifest.json          schema, author attribution, profile/code hashes, required capabilities
source/                original references or optional embedded assets, content digests
geometry/              authoritative typed geometry program and transforms
fields/                sparse or tiled data with axes, units, resolution and epochs
state/                 genesis and canonical finite checkpoints
operations/            tagged edits, activation times, source history
lineage/               parent identities and explicit reproduction/mutation records
render/                appearance recipes, previews and renderer-specific adapters
verification/          conformance examples, numerical tolerances and evidence
```

The manifest should bind a separately stored runtime module digest, not attempt to include a hash of itself inside its own hashed bytes. Native code should not be executed merely because a capsule contains it: use a known versioned operator registry or a deliberately sandboxed runtime with explicit capabilities.

Use compatible established formats as views/adapters: glTF/GLB for runtime scene/mesh delivery; OpenUSD with OpenVDB for scene composition and time-varying volumetric assets; OME-Zarr or another declared multidimensional-array profile for scientific image/volume data. Pin supported versions and extensions. A geometry export need not preserve XD-TAU dynamics unless the capsule or an explicitly supported extension carries them.

## Crypto as provenance, not simulated life

Public art seeds, content hashes, organism identity, replica operation tags, parent/child lineage, cryptographic signatures, and blockchain transactions have different roles.

Start offline: canonical content, a public genesis seed, fixed profile, versioned runtime, source history, and checkpoint digests. Add authentication using signatures over canonical manifests/checkpoints when needed. Add a chain-specific adapter only for a clear shared-ledger purpose. Keep heavy field data off-chain and anchor selected digests or batch roots; availability still requires actual storage.

A CRDT-style merge is not blockchain consensus. XOR masks and bent Boolean channels from the source are not substitutes for SHA-256 or a signature scheme. A content hash is not encryption, proof of ownership, or evidence that a claimed biological/physical law is correct. An author-controlled seed is not impartial lottery randomness; a fair-selection use would need a separately specified protocol.

## Larger application concepts

**Photo-Spores:** recognizable image-derived pigments and compartments give rise to independently evolving specimens. The input remains a recorded observation, not just a random-number source.

**Klein Reefs:** thickened folded-sheet colonies with bounded-error geometry previews and visible boundary production. Distinguish the abstract immersed surface from its overlapping 3D volume.

**Shiitake Nebulae:** source-driven plume simulations or explicitly artistic analogues; brush directions follow declared flow or diagnostic fields.

**Chrono-Herbarium:** preserve a specimen’s entire replayable history, not just a looped movie. Scrub physical or log time, branch a history, and compare declared mutations.

**Living Atlas:** use binary equal-area cells for spatial streaming and a separate hyperbolic family/dependency browser for lineage. Collaboration merges tagged edits and replays their activation schedule rather than assuming merged logs alone restore trajectories.

**Organism asset toolkit:** the same capsule becomes an interactive installation, desktop artwork, educational model, game asset, volume sequence, printable geometry snapshot, or provenance-aware archive. Each export declares what it preserves and what it loses.

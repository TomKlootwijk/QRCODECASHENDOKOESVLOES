# XD-TAU Starry Membrane / finite profile 0.1.0

## Provenance and scope

This is a **new application specialization**, not a claim that SHA-256 genomes, a living-media file standard, or a Unity renderer are already defined by the source PDF. It reuses the document’s actual finite-state, geometry, membrane, transport, reaction, and replay constructions. The original specification’s attribution is preserved.

Page references below refer to the supplied 71-page v1.5 PDF. Source equation IDs refer to the equations as rendered, not inferred from missing text extraction.

## State described through the architecture

The state is `S_n = (E_n, H_n, P_n, xi_n, b_n, F_n, O_n, C_n)` plus explicit profile/clock/source/ledger metadata (PDF p. 3, equation 1.1).

| Field | This application’s operational meaning |
|---|---|
| E | 32 stable reactor IDs, root-organism identity, chart locations, pixel observations; identity is distinct from spatial address |
| H | Owned equal-area binary spherical leaves at depth 5, word/key/heap address, angular intervals, solid angles, representatives |
| P | A finite `Difference(Sphere(Ro), Sphere(Ri))` program for each concentric local shell |
| xi | Declared positive reaction, deposition, diffusion and partition coefficients; visual phase stored separately by role |
| b | Logical allele bits; JavaScript numeric arrays, not a claimed succinct packed implementation |
| F | Local concentrations `(f,a,b,m)`, reservoir precursor `fb`, deposited shell amount `Ns`, thermal energy, and a derived activity observation |
| O | Uniquely tagged feed and XOR operations with activation epochs and logical versions |
| C | Explicit photo-to-initial-data, shell-to-radius, radius-to-conductance, reaction-to-heat, and state-to-display mappings |

The root identity is `state.seed`; the `E` array contains its reactor children. The species named `b` inside a reactor is a chemical concentration, distinct from the top-level bit array `state.b`.

## Input and genesis

The source adapter freezes an RGB8 raster. Browser image import fits the decoded image into a 48 by 32 black-letterboxed canvas and records the exact resulting pixels. These are *artistic encoded color samples*, not a linear radiometric energy measurement or depth reconstruction. The original file bytes have their own SHA-256 when supplied.

The genesis digest hashes an unambiguous canonical array containing a domain tag, the complete declared profile descriptor, canonical pixel digest, and public art seed. Independent streams derive samples by hashing another domain tag, the genesis, a channel label, and a counter. The first 32 digest bits are divided by `2^32` for a deterministic sample in `[0,1)`.

Sorted JSON is restricted to this finite application data. The implementation is not advertised as a fully audited general RFC 8785 implementation. Runtime behavior is versioned; the package manifest independently identifies delivered source bytes.

The source’s color/lightness values also enter a separate feature path. Initial precursor `f` and reservoir `fb` depend on sampled lightness; the renderer uses sampled color. Changing a hash is not claimed to preserve perceptual similarity.

## Membrane and reaction model

The source uses a fixed core radius `Ri > 0`, `V = 4*pi*Ri^3/3`, reservoir volume `Vb > 0`, and initially positive `Ns`. This profile chooses normalized `V=1`, `Vb=6`, and molar volume `vbar=0.8`. All other constants and initialization formulas are in `organism_core.js` and serialized profile/parameter data. There is no empirical biological or material calibration.

From PDF p. 36, D.1:

```text
Ro = (Ri^3 + 3*vbar*Ns/(4*pi))^(1/3)
G  = 4*pi*Ds*Kpart*Ri*Ro/(Ro - Ri)
```

The catalytic channels from p. 26, 24.3–24.4, are:

```text
F + B     -> A + B          v1 = k1*f*b
F + A     -> B + A          v2 = k2*f*a
F + A + B -> M + A + B      v3 = k3*f*a*b
```

Reaction subflows consume precursor once and add it to one product once (p. 35, C.10–C.12). Deposition transfers dissolved `m` into `Ns` (C.14). The body-plus-reservoir monomer ledger is:

```text
amount = V*(f + a + b + m) + Ns + Vb*fb
```

The exothermic chemical-energy choice is `eF=1`, `eA=eB=eM=eShell=0`. Each consumed precursor amount adds the same energy to the thermal reservoir (C.13):

```text
energy = V*f + Vb*fb + heat
```

Changing rate coefficients changes kinetics, not these stored species energies. Feed inputs add their declared amount and chemical energy to the source ledger. Display light does not drain or create these physical-model energy reservoirs, because it is an explicitly nonphysical observation.

## Causal update

This application declares its own reduced schedule, as permitted by the architecture’s composition rule (pp. 32 and 52):

```text
materialize due tagged events
-> freeze shell conductance and declared rate coefficients
-> exact frozen-coefficient two-reservoir precursor exchange
-> catalytic subflow 1
-> catalytic subflow 2
-> catalytic subflow 3
-> dissolved-to-shell deposition
-> write next geometry program
-> expose observations
```

The exchange is the source’s positive two-cell map (p. 34, C.7–C.8), implemented as convex weights. Every reaction/deposition exponential subflow has nonnegative outputs and shared transfers. The ordered coupled step is a first-order split approximation, not the exact simultaneous membrane ODE solution. The floating implementation measures residuals, not exact rational conservation.

No candidate state is clipped, rolled back, or rejected inside this update. Import validation and test assertions are outside evolution. Clamps in image sampling, display projection, or RGB display quantization belong only to input/render adapters and do not alter evolving inventories.

The step is `dt=0.04`; `t=n*dt`; `T=ln(1+t/tStar)`, `tStar=1`. Rendering frequency does not change the selected next state for a given tick index. Playback advances a chosen number of fixed steps per displayed frame, so playback speed is not a wall-clock real-time promise. No relativistic spacetime solver is inferred from the presence of a time coordinate.

## Events and self-production

Tags are `(replica, sequence)`. Repeated delivery of one tag applies once. Equal XOR payloads with different tags apply separately and can cancel. Same-tag payload collisions use a declared canonical maximum before replay. Activation epochs are retained. A late edit replays from genesis with the merged log; matching logs alone are not claimed to equalize previously diverged physical trajectories (PDF pp. 31 and 49).

Internal reactions produce dissolved material, deposition produces the defining shell, and that shell changes the next tick’s uptake. This is the implemented self-producing connection. There is no same-step recursive code execution, automatic code synthesis, biological reproduction, consciousness, or Darwinian selection claim.

## Geometry and rendering distinction

Each local concentric shell is a region represented by a finite sphere-difference program. The physical core volume is fixed; shell accretion is not silently modeled as deformation of that fixed core (source pp. 38 and 54).

The full-portrait renderer maps angular samples, local shell growth, source colors, and kinetic observations into curved brush strokes. Its deformed globe is an *artistic chart*, not an exact global Boolean union, an exact signed-distance field, or a physical moving mesh. The membrane view normalizes the selected outer radius and draws the fixed-core radius proportionally.

Canvas filtering provides a neon-like display preview. This is not an HDR framebuffer, volumetric scattering, or an independently simulated fluid. Those remain explicitly proposed adapters.

## Reproducibility contract

Checkpoints retain finite profile data, exact normalized RGB8 pixels, genesis, tags/epochs, state, and a SHA-256 digest of canonical state encoding. Import verifies the digest and performs full replay with the recorded inputs in the current runtime.

The tested contract is same-runtime finite-state replay. Neither JavaScript transcendental evaluation across all runtimes nor GPU pixel output is promised bitwise identical across hardware. A production implementation needs a fixed numerical backend or recorded authoritative state, versioned image preprocessing, code-module digests, explicit tolerances where appropriate, and a separate renderer/display contract.

The included checkpoint is unsigned. A changed untrusted state can be rehashed by its editor; a hash alone provides no author authentication. It is useful relative to a trusted expected digest and as content identity, not as a complete security boundary.

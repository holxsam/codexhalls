import { ShaderChunk } from "three";

const vertexShader = /* glsl */ `
  precision mediump float;
  precision mediump int;

  attribute vec4 color;
  varying vec4 vColor;

  void main() {
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  precision mediump int;

  varying vec4 vColor;

  void main() {
    vec4 color = vec4(vColor);
    gl_FragColor = color;
 }
`;

const vertexShader1 = /* glsl */ `
  #include <common>
  #include <uv_pars_vertex>
  #include <envmap_pars_vertex>
  #include <color_pars_vertex>
  #include <fog_pars_vertex>
  #include <morphtarget_pars_vertex>
  #include <skinning_pars_vertex>
  #include <logdepthbuf_pars_vertex>
  #include <clipping_planes_pars_vertex>
  void main() {
    #include <uv_vertex>
    #include <color_vertex>
    #include <morphcolor_vertex>
    #if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
    #endif
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    #include <worldpos_vertex>
    #include <envmap_vertex>
    #include <fog_vertex>
  }
`;

const vertexShader2 = /* glsl */ [
  ShaderChunk["common"],
  ShaderChunk["uv_pars_vertex"],
  ShaderChunk["envmap_pars_vertex"],
  ShaderChunk["color_pars_vertex"],
  ShaderChunk["fog_pars_vertex"],
  ShaderChunk["morphtarget_pars_vertex"],
  ShaderChunk["skinning_pars_vertex"],
  ShaderChunk["logdepthbuf_pars_vertex"],
  ShaderChunk["clipping_planes_pars_vertex"],
  "void main() {",
  ShaderChunk["uv_vertex"],
  ShaderChunk["color_vertex"],
  ShaderChunk["morphcolor_vertex"],
  "#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )",
  ShaderChunk["beginnormal_vertex"],
  ShaderChunk["morphnormal_vertex"],
  ShaderChunk["skinbase_vertex"],
  ShaderChunk["skinnormal_vertex"],
  ShaderChunk["defaultnormal_vertex"],
  "#endif",
  ShaderChunk["begin_vertex"],
  ShaderChunk["morphtarget_vertex"],
  ShaderChunk["skinning_vertex"],
  ShaderChunk["project_vertex"],
  ShaderChunk["logdepthbuf_vertex"],
  ShaderChunk["clipping_planes_vertex"],
  ShaderChunk["worldpos_vertex"],
  ShaderChunk["envmap_vertex"],
  ShaderChunk["fog_vertex"],
  "}",
].join("\n");

const fragmentShader1 = /* glsl */ `
  uniform vec3 diffuse;
  uniform float opacity;
  #ifndef FLAT_SHADED
    varying vec3 vNormal;
  #endif
  #include <common>
  #include <dithering_pars_fragment>
  #include <color_pars_fragment>
  #include <uv_pars_fragment>
  #include <map_pars_fragment>
  #include <alphamap_pars_fragment>
  #include <alphatest_pars_fragment>
  #include <alphahash_pars_fragment>
  #include <aomap_pars_fragment>
  #include <lightmap_pars_fragment>
  #include <envmap_common_pars_fragment>
  #include <envmap_pars_fragment>
  #include <fog_pars_fragment>
  #include <specularmap_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  void main() {
    #include <clipping_planes_fragment>
    vec4 diffuseColor = vec4( diffuse, opacity );
    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <alphahash_fragment>
    #include <specularmap_fragment>
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    #ifdef USE_LIGHTMAP
      vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
      reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
    #else
      reflectedLight.indirectDiffuse += vec3( 1.0 );
    #endif
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= diffuseColor.rgb;
    vec3 outgoingLight = reflectedLight.indirectDiffuse;
    #include <envmap_fragment>
    #include <opaque_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>
  }
`;

const fragmentShader2 = /* glsl */ [
  "uniform vec3 diffuse;",
  "uniform float opacity;",
  "#ifndef FLAT_SHADED",
  "varying vec3 vNormal;",
  "#endif",
  ShaderChunk["common"],
  ShaderChunk["dithering_pars_fragment"],
  ShaderChunk["color_pars_fragment"],
  ShaderChunk["uv_pars_fragment"],
  ShaderChunk["map_pars_fragment"],
  ShaderChunk["alphamap_pars_fragment"],
  ShaderChunk["alphatest_pars_fragment"],
  ShaderChunk["alphahash_pars_fragment"],
  ShaderChunk["aomap_pars_fragment"],
  ShaderChunk["lightmap_pars_fragment"],
  ShaderChunk["envmap_common_pars_fragment"],
  ShaderChunk["envmap_pars_fragment"],
  ShaderChunk["fog_pars_fragment"],
  ShaderChunk["specularmap_pars_fragment"],
  ShaderChunk["logdepthbuf_pars_fragment"],
  ShaderChunk["clipping_planes_pars_fragment"],
  "void main() {",
  ShaderChunk["clipping_planes_fragment"],
  "vec4 diffuseColor = vec4( diffuse, opacity );",
  ShaderChunk["logdepthbuf_fragment"],
  ShaderChunk["map_fragment"],
  ShaderChunk["color_fragment"],
  ShaderChunk["alphamap_fragment"],
  ShaderChunk["alphatest_fragment"],
  ShaderChunk["alphahash_fragment"],
  ShaderChunk["specularmap_fragment"],
  "ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );",
  "#ifdef USE_LIGHTMAP",
  "vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );",
  "reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;",
  "#else",
  "reflectedLight.indirectDiffuse += vec3( 1.0 );",
  "#endif",
  ShaderChunk["aomap_fragment"],
  "reflectedLight.indirectDiffuse *= diffuseColor.rgb;",
  "vec3 outgoingLight = reflectedLight.indirectDiffuse;",
  ShaderChunk["envmap_fragment"],
  ShaderChunk["opaque_fragment"],
  ShaderChunk["tonemapping_fragment"],
  ShaderChunk["colorspace_fragment"],
  ShaderChunk["fog_fragment"],
  ShaderChunk["premultiplied_alpha_fragment"],
  ShaderChunk["dithering_fragment"],
  "}",
].join("\n");

const uniforms1 = {
  diffuse: { value: 16777215 },
  opacity: { value: 1 },
  map: { value: null },
  mapTransform: { value: { elements: [1, 0, 0, 0, 1, 0, 0, 0, 1] } },
  alphaMap: { value: null },
  alphaMapTransform: { value: { elements: [1, 0, 0, 0, 1, 0, 0, 0, 1] } },
  alphaTest: { value: 0 },
  specularMap: { value: null },
  specularMapTransform: { value: { elements: [1, 0, 0, 0, 1, 0, 0, 0, 1] } },
  envMap: { value: null },
  flipEnvMap: { value: -1 },
  reflectivity: { value: 1 },
  ior: { value: 1.5 },
  refractionRatio: { value: 0.98 },
  aoMap: { value: null },
  aoMapIntensity: { value: 1 },
  aoMapTransform: { value: { elements: [1, 0, 0, 0, 1, 0, 0, 0, 1] } },
  lightMap: { value: null },
  lightMapIntensity: { value: 1 },
  lightMapTransform: { value: { elements: [1, 0, 0, 0, 1, 0, 0, 0, 1] } },
  fogDensity: { value: 0.00025 },
  fogNear: { value: 1 },
  fogFar: { value: 2000 },
  fogColor: { value: 16777215 },
};

{
  /* <shaderMaterial
  ref={shaderMatRef}
  fragmentShader={fragmentShaderJS}
  vertexShader={vertexShaderJS}
  uniforms={{ opacity: { value: 0.1 } }}
  vertexColors
  transparent
  // opacity={0.5}
  onBeforeCompile={(e) => {
    // console.log(e.vertexShader);
    // console.log(e.fragmentShader);
    // console.log(JSON.stringify(e.uniforms));
    console.log(e.uniforms);
  }}
/>; */
}

import { extend, useFrame, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

extend({ EffectComposer, RenderPass, UnrealBloomPass })

function Bloom({ children, camera }) {
  const { gl } = useThree()
  const [scene, setScene] = useState(null)
  const composer = useRef(null)
  useFrame(() => scene && composer.current.render(), 1)
  return (
    <>
      <scene ref={setScene}>
        <color attach="background" args={[0, 0, 0]} />
        {children}
      </scene>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass scene={scene} camera={camera} />
        <unrealBloomPass attachArray="passes" args={[undefined, 15, 0.01, 0]} />
      </effectComposer>
    </>
  )
}

export default Bloom;
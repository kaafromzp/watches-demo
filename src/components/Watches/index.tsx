import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Instance, Instances, OrthographicCamera, RenderTexture, Text, useGLTF } from '@react-three/drei'
import { GroupProps, useFrame, useThree } from '@react-three/fiber'
import { BufferGeometry, Group, BufferAttribute, Color, MeshStandardMaterial, Texture, MeshPhysicalMaterial } from 'three'
import useStore from '../../store';
import { easings, useSpring, animated } from '@react-spring/three';

const AnimatedText = animated(Text)
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const glassMaterial = new MeshPhysicalMaterial({
  transparent: true,
  opacity: 0.25,
  reflectivity: 0,
  metalness: 0.9,
  roughness: 0.3,
  clearcoat: 5,
  clearcoatRoughness: 0,
  specularIntensity: 1,
  specularColor: new Color('white'),
  envMapIntensity: 0.15
})

function timeToAngle(arrow: 'hours' | 'minutes' | 'seconds', time: string) {
  const numbers = time.split(':').map((s) => s.slice(0, 2))
  switch (arrow) {
    case 'seconds':
      return ((Number(numbers[2]) % 60) * Math.PI / 30)
    case 'minutes':
      return ((Number(numbers[1]) % 60) * Math.PI / 30 + (Number(numbers[2]) % 60) * Math.PI / 30 / 60)
    case 'hours':
      return ((Number(numbers[0]) % 12) * Math.PI / 6 + (Number(numbers[1]) % 60) * Math.PI / 30 / 60 + (Number(numbers[2]) % 60) * Math.PI / 30 / 3600)
  }
}

export function Watches(props: GroupProps) {
  const mainColor = useStore(state => state.mainColor)

  useEffect(() => {
    const c = new Color(mainColor)
    colorMaterial.color = c
    materials.rear.map = null
    materials.rear.color = c
    materials.belt.color = c
    materials.button.color = c
    materials.button.color = c
    materials.shall.color = c
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const springs = useSpring({
    config: { duration: 1500, easing: easings.easeInOutCubic },
    color: mainColor,
    onChange: ({ value: { color } }) => {
      const c = new Color(color)
      colorMaterial.color = c
      materials.rear.map = null
      materials.rear.color = c
      materials.belt.color = c
      materials.button.color = c
      materials.button.color = c
      materials.shall.color = c
    }
  })

  const colorMaterial = useMemo(() => new MeshStandardMaterial({ transparent: true }), [])
  const greyMaterial = useMemo(() => new MeshStandardMaterial({ transparent: true, metalness: 0.95, roughness: 0.5, color: '#303030' }), [])

  const [time, setTime] = useState(new Date().toLocaleTimeString())
  useEffect(() => {
    setInterval(() => { setTime(new Date().toLocaleTimeString()) }, 1000)
  }, [])

  const ref = useRef(new Group())
  const cameraRef = useRef(null)
  //@ts-ignore
  const { nodes, materials } = useGLTF('/smartwatches.glb', true)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = Math.sin(t / 4) / 8
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 50
  })

  useEffect(() => { }, [])

  const instanceData = useMemo(() => {
    return new Array(12).fill(0).map((e, i) => 2 * Math.PI * (i / 12))
  }, [])

  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const radius = 0.63;
    const width = 0.05;
    const height = 0.1;
    const vertices = new Float32Array([
      -width * 0.5, radius + height * 0.5, 0,
      -width * 0.5, radius - height * 0.5, 0,
      width * 0.5, radius + height * 0.5, 0,
      width * 0.5, radius + height * 0.5, 0,
      -width * 0.5, radius - height * 0.5, 0,
      width * 0.5, radius - height * 0.5, 0,
    ]);
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    geometry.computeVertexNormals()

    return geometry
  }, [])

  const geometry2 = useMemo(() => {
    const geometry = new BufferGeometry();
    const radius = 0.55;
    const width = 0.007;
    const vertices = new Float32Array([
      -width * 0.5, radius, 0,
      -width * 0.5, 0, 0,
      width * 0.5, radius, 0,
      width * 0.5, radius, 0,
      -width * 0.5, 0, 0,
      width * 0.5, 0, 0,
    ]);
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    geometry.computeVertexNormals()

    return geometry
  }, [])

  const cretaeArrowGeometry = useCallback((width: number, length: number) => {
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      width * 0.5, 0, 0,
      -width * 0.5, 0, 0,
      0, -length, 0
    ]);
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    geometry.computeVertexNormals()
    return geometry
  }, [])

  const [t, setT] = useState(null as null | Texture)

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
    >
      <RenderTexture
        width={256}
        height={256}
        attach={'map'}
        sourceFile={undefined}
        ref={(a: Texture) => { setT(a) }}>
        <color attach="background" args={[0, 0, 0]} />
        <OrthographicCamera ref={cameraRef} near={1e-3} far={1e3} left={-1} right={1} top={310 / 256} bottom={-310 / 256} makeDefault manual position={[0, 0, 1]} />
        <pointLight intensity={2} position={[0, -1, 0.5]} />
        <ambientLight intensity={0.7} />
        <AnimatedText color={springs.color} fontSize={0.12} position-y={0.97} rotation-x={Math.PI}>
          {time}
        </AnimatedText>
        <AnimatedText color={springs.color} fontSize={0.12} position-y={1.1} rotation-x={Math.PI}>
          {timeZone}
        </AnimatedText>
        <Instances
          range={instanceData.length}
          limit={instanceData.length}
          geometry={geometry2}
          material={greyMaterial}
        >
          {instanceData.map((data, i) => (
            <Instance
              key={i}
              rotation-z={data}
            />
          ))}
        </Instances>
        <mesh
          material={greyMaterial}
        >
          <ringGeometry args={[0.7, 0.75]} />
        </mesh>
        <mesh
          material={greyMaterial}
        >
          <ringGeometry args={[0.55, 0.56]} />
        </mesh>
        <mesh
          rotation-z={timeToAngle('hours', time)}
          geometry={cretaeArrowGeometry(0.07, 0.65)}
          material={colorMaterial}
        />
        <mesh
          rotation-z={timeToAngle('minutes', time)}
          geometry={cretaeArrowGeometry(0.05, 0.5)}
          material={colorMaterial}
        />
        <mesh
          rotation-z={timeToAngle('seconds', time)}
          geometry={cretaeArrowGeometry(0.035, 0.4)}
          material={colorMaterial}
        />
        <mesh
          material={colorMaterial}
        >
          <circleGeometry args={[0.025]} />
        </mesh>
        <Instances
          range={instanceData.length}
          limit={instanceData.length}
          geometry={geometry}
          material={greyMaterial}
        >
          {instanceData.map((data, i) => (
            <Instance
              key={i}
              rotation-z={data}
            />
          ))}
        </Instances>
      </RenderTexture>
      <mesh receiveShadow geometry={nodes.smartwatches_primitive0.geometry} material={materials.belt} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive1.geometry} material={materials.rear} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive2.geometry} material={materials.back} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive4.geometry} material={materials.glass_black} />
      <mesh geometry={nodes.smartwatches_primitive5.geometry}>
        <meshStandardMaterial
          depthTest={false}
          envMapIntensity={0}
          transparent map={t}
          emissiveMap={t}
          emissiveIntensity={4}
          emissive={new Color('white')}
        />
      </mesh>
      <mesh receiveShadow geometry={nodes.smartwatches_primitive3.geometry} material={glassMaterial} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive6.geometry} material={materials.button1} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive7.geometry} material={materials.rings} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive8.geometry} material={materials.detectors} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive9.geometry} material={materials.button} />
      <mesh receiveShadow geometry={nodes.smartwatches_primitive10.geometry} material={materials.shall} />
    </group >
  )
}

useGLTF.preload('/smartwatches.glb')


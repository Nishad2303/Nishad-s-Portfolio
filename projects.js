(() => {
const projectData = [
  {
    id: 'ev-simulation', category: 'simulation', categoryLabel: 'Simulation / Controls', accent: 'gold',
    title: 'EV Vehicle Simulation', tagline: 'Validating an electric powertrain before it touches the road.',
    card: 'A two-wheeled EV model tested against real drive cycles, with regenerative braking and a closer look at where the model diverged from reality.',
    overview: 'Built a MATLAB and Simulink model of a two-wheeled electric vehicle and compared its response with measured acceleration and deceleration drive-cycle data.',
    build: 'Reference and feedback speeds tracked closely through the cycles. During deceleration, the model also showed battery-charge recovery from regenerative braking. I identified and documented a vehicle-mass discrepancy that affected the deceleration response.',
    tools: ['MATLAB', 'Simulink', 'EV dynamics', 'Control systems', 'Drive-cycle validation'],
    learning: 'A model earns trust by being checked against real data. The most useful result was finding where an assumption stopped matching the measured system.',
    images: ['EV Vehicle Simulation 1.png'], cover: 'EV Vehicle Simulation 1.png',
  },
  {
    id: 'cardiac-safety', category: 'automation', categoryLabel: 'Embedded / Safety', accent: 'coral',
    title: 'Cardiac Arrest Detection Device', tagline: 'A vehicle safety system designed to react when its driver cannot.',
    card: 'A real-time pulse monitor that can share the vehicle location and start a controlled pull-over sequence when readings leave the safe range.',
    overview: 'Integrated heart-rate monitoring, GPS/GSM communication, ultrasonic sensing, and servo actuation into a vehicle emergency-response prototype.',
    build: 'The system flags readings below 65 bpm or above 160 bpm, sends the GPS location over GSM, and uses ultrasonic sensing with a servo-driven sequence to guide a safe stop. The four modules were connected and tested as one pipeline.',
    tools: ['Arduino UNO', 'Pulse sensor', 'GPS / GSM', 'Ultrasonic sensor', 'Servo', 'Embedded programming'],
    learning: 'Safety logic has to be designed around the worst case. I focused on how the modules behaved together through one complete failure-response scenario.',
    images: ['Cardiac Arrest Detection Device for Drivers 1.png', 'Cardiac Arrest Detection Device for Drivers 2.jpg', 'Cardiac Arrest Detection Device for Drivers 3.png'], cover: 'Cardiac Arrest Detection Device for Drivers 1.png',
  },
  {
    id: 'smart-home-lighting', category: 'automation', categoryLabel: 'Embedded / Automation', accent: 'gold',
    title: 'Smart Home Lighting', tagline: 'Useful automation without the overengineering.',
    card: 'An 8051-based lighting controller simulated end to end, with keypad-selected modes and an energy-saving option.',
    overview: 'Created a modular lighting-control system in Proteus, connecting keypad input, preset lighting modes, and status display in a complete virtual circuit.',
    build: 'The simulation brings together an 8051 microcontroller, a 4×3 keypad, LEDs, and a 7-segment display. Its modular structure leaves room to add IoT control later.',
    tools: ['8051 / Atmel', 'Assembly / C', 'Proteus', '4×3 keypad', 'LEDs', '7-segment display'],
    learning: 'Planning for extension early makes later features easier to add. The modular setup allows an IoT layer without rebuilding the core controller.',
    images: ['Smart Home Control 1.png'], cover: 'Smart Home Control 1.png',
  },
  {
    id: 'conveyor-hmi', category: 'automation', categoryLabel: 'Industrial Automation', accent: 'coral',
    title: 'Industrial Conveyor Automation', tagline: 'Controlling a virtual factory floor from a phone.',
    card: 'A Factory I/O conveyor, ladder-logic control, and wireless Android HMI brought together for remote monitoring and operation.',
    overview: 'Built and tested a virtual material-handling line, connecting conveyor inflow and outflow logic with a wireless HMI for remote control.',
    build: 'Sensors and counters were integrated with ladder logic and checked for reliable response. The Android HMI provided a practical view of the process and remote controls.',
    tools: ['Factory I/O', 'LOGO! Soft Comfort', 'CODESYS', 'Ladder logic', 'Android HMI', 'Sensors & counters'],
    learning: 'A connected interface is only useful when it responds consistently. Testing responsiveness and process feedback was as important as making the wireless link work.',
    images: ['Screenshot 2024-01-16 111453.png', 'Screenshot (1).png', 'Screenshot (2).png', 'Screenshot 2024-01-16 111647.png', 'Screenshot 2024-01-16 111914.png', 'Screenshot 2024-01-16 112018.png'], cover: 'Screenshot 2024-01-16 111453.png', folder: 'HMI  Simulation',
  },
  {
    id: 'pulsar-handle', category: 'design', categoryLabel: 'Reverse Engineering', accent: 'gold',
    title: "Pulsar 150 Handle Assembly", tagline: 'Using careful measurement as a design tool.',
    card: 'A motorcycle handle assembly disassembled, measured, and redrawn to understand its geometry, tolerances, and opportunities for refinement.',
    overview: 'Reverse-engineered a Pulsar 150 handle assembly, documenting the bar, mirrors, switches, and ignition components through precision measurement and technical drawings.',
    build: 'Components were disassembled and measured with micrometers, then translated into drawings and models. The study examined how the original design could be understood and potentially improved for weight and cost.',
    tools: ['Micrometers', 'Component disassembly', 'Technical drafting', 'CAD modeling', 'Cost analysis'],
    learning: 'Measurement tells the story behind the shape: fit, tolerance, performance, and the cost choices embedded in a real assembly.',
    images: ['render1.0.10.png', 'render1.0.11.png', 'render1.0.12.png', 'render1.0.13.png', 'render1.0.14.png', 'render1.0.15.png', 'render1.0.16.png', '2.0-1.png', '3.0-1.png', '4.0-1.png', '5.0-1.png', '60-1.png', '7.0-1.png', '8.0-1.png', 'photo_2024-02-14_14-54-44.jpg', 'photo_2024-02-14_15-16-33.jpg', 'photo_2024-02-14_15-20-58.jpg', 'photo_2024-02-14_16-44-20.jpg', 'photo_2024-02-14_16-44-21.jpg', 'photo_2024-02-14_16-49-12.jpg', 'photo_2024-02-14_16-51-08.jpg', 'photo_2024-02-15_23-05-59.jpg', 'photo_2024-02-15_23-16-19.jpg'], cover: 'render1.0.10.png', folder: 'Reverse Engineering on Handle Assembly of Pulsar Bike',
  },
  {
    id: 'recycler', category: 'design', categoryLabel: 'Sustainable Making', accent: 'coral',
    title: '3D-Printed Waste Recycler', tagline: 'Closing the loop for under ₹3,000.',
    card: 'A compact shredder, extruder, and spooler concept turns failed prints and support waste back into usable filament.',
    overview: 'Designed and prototyped a low-cost filament-recycling machine that processes failed prints and support material through shredding, extrusion, and spooling.',
    build: 'An Arduino coordinates the subsystems. The machine was designed around a budget of about ₹3,000, excluding the extrusion screw. FEA and FMEA informed the design, and the output filament was compared with virgin material.',
    tools: ['3D CAD', 'Arduino', 'ANSYS Workbench', 'Altair HyperMesh', 'Altair Inspire', 'FEA / FMEA', 'Material testing'],
    learning: 'Recycled filament has to perform well enough to replace new material. Comparing the output with virgin filament kept the goal grounded in actual use.',
    images: ['3D printed waste recycler 1.png', '3D printed waste recycler 2.gif', '3D printed waste recycler 3.jpg', '3D printed waste recycler 4.jpg'], cover: '3D printed waste recycler 1.png',
  },
  {
    id: 'fishing-drone', category: 'aerospace', categoryLabel: 'Aerospace / Autonomy', accent: 'gold',
    title: 'Autonomous Fishing Drone', tagline: 'Bringing machine learning into the flight plan.',
    card: 'A fish-detection concept paired with geofenced flight, obstacle avoidance, and a servo-operated payload grabber.',
    overview: 'Developed an autonomous quadcopter concept that combines image-based fish detection with flight mechanics, navigation, and a payload mechanism.',
    build: 'The detection model was prepared with LabelImg and Google Colab. A Pixhawk 2.4.8, Here3+ GPS, and telemetry support autonomous geofenced paths and obstacle avoidance. CFD and FEA were used to validate a lightweight frame against a 2:1 thrust-to-weight target; the build achieved about 10 minutes of endurance.',
    tools: ['LabelImg', 'Google Colab', 'Gazebo', 'ANSYS', 'Pixhawk 2.4.8', 'Here3+ GPS', 'CFD / FEA', 'Servo grabber'],
    learning: 'A light frame only matters when the full aircraft can meet its mission. Structure, aerodynamics, propulsion, avionics, and software have to work as one system.',
    images: ['1.jpg', 'AEROTHON_2023_II FINAL1.png', 'AEROTHON_2023_II FINAL2.png', 'AEROTHON_2023_II FINAL3.png', 'untitled.34.png', 'untitled.35.png', 'untitled.36.png', 'untitled.37.png', 'untitled.38.png'], cover: '1.jpg', folder: 'Autonomous Fishing Drone',
  },
  {
    id: 'isro-magnetic-sensor', category: 'aerospace', categoryLabel: 'ISRO–LEOS / Structural Qualification', accent: 'gold', featured: true,
    title: 'Magnetic Field Sensor', tagline: 'Structural qualification for spaceflight.',
    card: 'Taking a spacecraft magnetic sensor from detailed 3D assembly to launch-load qualification, with analysis correlated against physical shock testing.',
    overview: 'At ISRO–LEOS, I modelled the magnetic field sensor assembly and assessed its mechanical integrity under the dynamic and static loads expected during launch.',
    build: 'The housing, cover, sensor bobbin, PCB cards, sensor holder, and filter housing were modelled in Siemens NX. Modal, quasi-static, shock, and random-vibration analyses evaluated the assembled design. The first natural frequency exceeded 200 Hz, and the analysed components remained within allowable stress and deformation limits with a factor of safety above 2. Physical shock testing stayed within qualification limits, with no damage and the sensor still electrically functional.',
    tools: ['Siemens NX', 'Simcenter Nastran', 'NX Nastran SOL 111', 'Modal analysis', 'Quasi-static analysis', 'Random vibration', 'Shock qualification'],
    learning: 'The strongest evidence came from connecting simulation to the physical qualification test. That correlation built confidence that the sensor assembly could withstand launch conditions.',
    images: ['1.0.png', '2.0.png', 'Picture5.png', 'Picture6.png'], cover: '1.0.png', folder: 'magnetic field sensor',
    fullContent: [
      { type: 'heading', text: 'Internship context' },
      { type: 'meta', text: 'Nishad Hooli — Laboratory for Electro-Optics Systems (LEOS), Indian Space Research Organisation' },
      { type: 'paragraph', text: 'Two projects from the same internship, both answering the same underlying question in different hardware: how do you make something trustworthy enough for space before it ever leaves the ground?' },
      { type: 'heading', text: 'Magnetic Field Sensor — Structural Qualification for Spaceflight' },
      { type: 'subheading', text: 'Project overview' },
      { type: 'paragraph', text: "Satellites rely on Earth's magnetic field for orientation and attitude determination, making magnetic field sensors critical components of spacecraft instrumentation. This project focused on taking a Magnetic Field Sensor from 3D modelling to structural qualification, ensuring its mechanical integrity and functional reliability under the extreme dynamic and static loads experienced during launch." },
      { type: 'heading', text: 'Design and Modelling' },
      { type: 'paragraph', text: 'Every component — housing, top cover, sensor bobbin, PCB cards, sensor holder, and filter housing — was modelled in Siemens NX, capturing the complete functional assembly, mass distribution, contact interfaces, and geometry required for modal, quasi-static, shock, and random vibration analysis.' },
      { type: 'paragraph', text: 'Material selection was driven by structural performance and functional requirements: AA6061-T6 aluminium for the housing and cover, offering an excellent strength-to-weight ratio; SS304 for non-magnetic bolted connections, minimizing magnetic interference; and PEEK for the sensor bobbin, selected for its thermal stability and dimensional precision under load.' },
      { type: 'heading', text: 'Simulation Methodology' },
      { type: 'paragraph', text: 'The assembly was meshed in Siemens NX using a combination of 2D mapped, 3D swept, extruded, and revolved mesh techniques, selected according to individual component geometries. Swept meshes were applied to cylindrical components, revolved meshes to axisymmetric parts, and mapped shell meshes to thin-walled structures such as the top cover.' },
      { type: 'paragraph', text: 'Surface-to-surface glue contacts connected the separately meshed components to establish an integrated structural assembly model in Simcenter Nastran.' },
      { type: 'heading', text: 'Results and Structural Validation' },
      { type: 'result', text: 'Modal Analysis: The first natural frequency exceeded the required 200 Hz threshold, providing sufficient separation from external excitation frequencies and minimizing the risk of resonance.' },
      { type: 'result', text: 'Quasi-Static Analysis: Under 1g loading along the X, Y, and Z axes, combined with ±1°C thermal loading, all components remained within allowable stress and deformation limits, maintaining a factor of safety above 2.' },
      { type: 'result', text: 'Random Vibration Analysis: The assembly was evaluated against standard launch-vehicle PSD profiles across all three axes. No critical stress failures were observed, with peak responses concentrated around thin, unsupported PCB sections.' },
      { type: 'result', text: 'Shock Qualification: Physical testing validated the simulation results. The measured Shock Response Spectrum remained within qualification limits, with no physical damage observed and the sensor retaining its electrical functionality after testing.' },
      { type: 'paragraph', text: "The project demonstrated the importance of correlating numerical simulations with physical qualification testing. By validating structural performance against actual test results, the work established confidence in the sensor assembly's ability to withstand the mechanical demands of spaceflight." },
      { type: 'tools', text: 'Tools used: Siemens NX, Simcenter Nastran, NX Nastran SOL 111.' },
    ],
  },
  {
    id: 'isro-mirror-support', category: 'aerospace', categoryLabel: 'ISRO–LEOS / Precision Optics', accent: 'coral', featured: true,
    title: 'Pneumatic Mirror Support System', tagline: 'Simulating zero gravity on the ground.',
    card: 'A precision pneumatic support concept counteracts gravity sag so space-mirror surfaces can be tested in a near-zero-gravity shape on Earth.',
    overview: 'Designed and validated a pneumatic support system for large, lightweight optical mirrors. Ground gravity can distort a mirror during interferometric testing, creating a surface error that would not exist in orbit.',
    build: 'Nine single-acting pneumatic cylinders and three hard supports carry the mirror on a granite base. Load cells and pressure sensors feed a control unit that adjusts air pressure; a dedicated air supply maintains pressure with better than 6 mbar sensitivity. Support positions and target forces were derived from Siemens NX and NX Nastran analysis. Testing on a mass-matched dummy mirror showed reduced gravitational sag and repeatable, stable operation within the stated tolerance.',
    tools: ['Siemens NX', 'NX Nastran', 'Finite element analysis', 'Interferometric testing', 'Pneumatic control', 'Load cells', 'Pressure regulation'],
    learning: 'Precision comes from treating analysis, control, and measurement as one system. The support forces predicted in FEA were carried into real pressure tuning and checked with interferometry.',
    images: ['setup.png', 'Picture1.png', 'Picture3.png', 'Picture4.png', 'Screenshot 2026-11-15 193845.png', 'FEA sensi.png'], cover: 'setup.png', folder: 'Pneumatic Mirror Support System — Simulating Zero Gravity on the Ground',
    fullContent: [
      { type: 'heading', text: 'Internship context' },
      { type: 'meta', text: 'Nishad Hooli — Laboratory for Electro-Optics Systems (LEOS), Indian Space Research Organisation' },
      { type: 'paragraph', text: 'Two projects from the same internship, both answering the same underlying question in different hardware: how do you make something trustworthy enough for space before it ever leaves the ground?' },
      { type: 'heading', text: 'Pneumatic Mirror Support System — Simulating Zero Gravity on the Ground' },
      { type: 'subheading', text: 'Project overview' },
      { type: 'paragraph', text: "Large, lightweight space mirrors have a problem Earth doesn't let them escape: gravity. Test one on the ground and it sags under its own weight, and that sag shows up as a false surface error during interferometric testing — a flaw that doesn't exist once the mirror is actually in orbit. This project designed, modelled, and validated a pneumatic support system built to cancel that sag out, holding large optical mirrors to within ±3 nanometres of their true, zero-gravity shape during ground testing." },
      { type: 'heading', text: 'System architecture' },
      { type: 'paragraph', text: "The system is built from three coordinated units. The Pneumatic Cylinder Unit carries the mirror's weight through nine single-acting pneumatic cylinders and three hard support pillars mounted on a granite base, each cylinder fitted with a load cell and a Delrin contact pad for soft, stable contact, all on titanium alloy (Ti6Al4V) adapters chosen for rigidity with minimal thermal distortion. The Control Unit closes the loop, reading load cells and pressure sensors in real time and adjusting air pressure regulators to hold each support point at its target force. The Air Supply Unit delivers that air with pressure control sensitive to better than 6 mbar." },
      { type: 'heading', text: 'Design approach' },
      { type: 'paragraph', text: "Support points were placed using whiffletree principles — the same load-distribution logic used throughout precision optics — positioned relative to the mirror's centroid to keep it in static equilibrium and minimise tilt, sag, and asymmetric deformation. Those positions weren't guessed: they came directly out of finite element analysis in Siemens NX and NX Nastran, which modelled the mirror under self-weight and extracted the exact reaction force each support point needed to carry, using RBE3 connections to distribute load realistically across each contact region instead of concentrating it at a single node." },
      { type: 'heading', text: 'Validation' },
      { type: 'paragraph', text: 'The FEA-predicted reaction forces were used to tune actual cylinder pressures on a dummy mirror matched to the real mirror\'s mass and dimensions. Surface flatness was then measured with an interferometer before and after pneumatic actuation — gravitational sag was minimised and the surface was restored to near-nominal shape, within tolerance, with the system also proving repeatable and stable across multiple test cycles.' },
      { type: 'paragraph', text: "This is a system that makes Earth briefly irrelevant to a mirror's shape, which is exactly what you need before trusting a space-bound optic." },
      { type: 'tools', text: 'Tools used: Siemens NX, NX Nastran, interferometric testing, pneumatic control systems.' },
    ],
  },
];

const coCurricularEntries = [
  {
    id: 'rc-aircraft', title: 'RC Aircraft', category: 'aerospace', categoryLabel: 'SAE ISS ADC 2022 / Regular Class RC Aircraft', categoryDetail: 'SAE ISS ADC 2022 — Regular Class RC Aircraft / SAE India Aero Design Challenge', image: 'RC Aircraft.jpg',
    description: 'A regular-class radio-controlled aircraft developed for the SAE India Aero Design Challenge, requiring aerodynamic optimization and a high payload capability.',
    contribution: 'Contributed to fabrication of the aircraft wing and prepared a detailed technical presentation that communicated the design and performance of the aircraft.',
    tools: 'Aircraft fabrication methods, aerodynamic optimization, technical presentation and documentation tools. The page does not name specific software.',
    result: 'The team secured All India Rank (AIR) #1. The aircraft achieved a payload fraction of 0.72, a payload capacity of 10.8 kg, a wingspan of 2.4 m, and a chord length of 0.498 m.',
    goals: 'Design and optimize a regular-class RC aircraft for the SAE India Aero Design Challenge, with emphasis on aerodynamic performance and payload capacity.',
    achievements: 'Achieved AIR #1 with the team; contributed to wing fabrication; delivered the technical presentation; and supported an aircraft design with the stated payload and dimensional performance.',
    skills: 'Wing fabrication, aerodynamic reasoning, technical communication, teamwork, problem-solving, and performance presentation.',
    scope: 'Applications include student aircraft design, payload-carrying UAV development, and future aerospace design competitions. Future scope can include further aerodynamic refinement, weight reduction, and performance validation.',
  },
  {
    id: 'aerothon-2022-drone', title: 'Autonomous Drone aK2022-010', category: 'aerospace', categoryLabel: 'SAE India Aerothon 2022', image: 'Autonomous Drone aK2022-010.jpg',
    description: 'A drone-oriented competition project focused on the overall UAV design, payload system, fabrication, electronics placement, and structural analysis.',
    contribution: 'Worked primarily on the payload system and fabrication; integrated additive manufacturing, laser cutting, CNC routing, and 4-axis milling; positioned electronic components; performed static structural analysis of drone parts; and contributed to technical reports and presentations.',
    tools: 'Additive manufacturing, laser cutting, CNC routing, 4-axis milling, electronic-component integration, Static Structural Analysis (SSA), technical reporting, and presentation tools.',
    result: 'The project provided hands-on experience in UAV design and advanced manufacturing and established a foundation for further work in drone design and autonomous systems. A competition ranking is not stated on the page.',
    goals: 'Develop a functional drone for Aerothon 2022 by integrating a payload system, fabricated structure, electronic components, and validated mechanical parts.',
    achievements: 'Designed and fabricated payload-related elements, integrated multiple manufacturing processes, completed structural analysis of parts, and supported the project’s technical documentation.',
    skills: 'UAV design, payload-system development, advanced manufacturing, electronics placement, structural analysis, technical documentation, and presentation.',
    scope: 'Applications include autonomous UAVs, payload delivery, inspection, and advanced manufacturing. Future work can improve autonomy, payload performance, structural efficiency, and field testing.',
  },
  {
    id: 'autonomous-drone-2023-010', title: 'Autonomous Drone aK2023-010', category: 'aerospace', categoryLabel: 'SAE ISS ADDC 2023 / Autonomous Drone Design Challenge', categoryDetail: 'SAE ISS ADDC 2023 — Autonomous Drone Design Challenge', image: 'Autonomous Drone aK2023-010.jpg',
    description: 'An autonomous UAV design and prototype-fabrication project focused on efficient autonomous payload delivery through generative design and structural optimization.',
    contribution: 'Contributed to overall UAV design and prototype fabrication, applied generative-design and structural-optimization principles, prepared the technical presentation, and communicated the design strengths to evaluators.',
    tools: 'Generative design, structural optimization, UAV design and fabrication methods, prototyping, and technical presentation tools. Specific software is not named on the page.',
    result: 'The team achieved All India Rank (AIR) #2 in the Autonomous Drone Design Challenge. The project strengthened expertise in UAV design and the combination of innovation with functional performance.',
    goals: 'Design and fabricate an efficient autonomous drone capable of delivering a payload while maintaining structural performance and practical functionality.',
    achievements: 'Helped develop and fabricate the UAV prototype, applied generative design and structural optimization, prepared the technical presentation, and contributed to an AIR #2 result.',
    skills: 'Generative design, structural optimization, UAV prototyping, design communication, technical presentation, and functional engineering.',
    scope: 'Applications include autonomous payload delivery, logistics, inspection, and emergency-response UAVs. Future scope includes more autonomous mission capability, improved payload efficiency, and real-world validation.',
  },
  {
    id: 'aerothon-2023-drone', title: 'Autonomous Drone aK2023-020', category: 'aerospace', categoryLabel: 'SAE India Aerothon 2023', image: 'Autonomous Drone aK2023-020.jpg',
    description: 'An advanced UAV design project aimed at robust operation under diverse real-world conditions through aerodynamic, structural, and control analysis.',
    contribution: 'Focused on conditional analyses and simulations, including CFD for aerodynamic optimization, Static Structural Analysis for structural integrity, and MATLAB-based stabilization and control analysis.',
    tools: 'Computational Fluid Dynamics (CFD), Static Structural Analysis (SSA), MATLAB, UAV design and simulation methods.',
    result: 'The analyses supported a drone design intended to be efficient, reliable, and suitable for practical operating demands. The page does not state a competition rank or numerical performance result.',
    goals: 'Create a robust and efficient UAV that can operate under varied conditions by combining aerodynamic, structural, and stabilization analysis.',
    achievements: 'Performed CFD, SSA, and MATLAB control analysis and used the results to inform a practical and reliable drone design.',
    skills: 'CFD, structural analysis, MATLAB control analysis, stabilization reasoning, simulation interpretation, and UAV design.',
    scope: 'Applications include UAVs for inspection, monitoring, delivery, and other field operations. Future work can add flight testing, advanced control laws, improved environmental modeling, and autonomous mission planning.',
  },
  {
    id: 'medical-drone-2024', title: 'Autonomous Drone aK2024-010', category: 'aerospace', categoryLabel: 'SAE ISS ADDC 2024 / Team Lead', categoryDetail: 'SAE ISS ADDC 2024 — Team Lead', image: 'Autonomous Drone aK2024-010.jpg',
    description: 'A medical-payload-delivery UAV project in which the team enhanced the aircraft design and completed prototype fabrication and testing for an autonomous drone challenge.',
    contribution: 'Served as Team Lead; oversaw UAV-design improvements; led prototype fabrication and testing; designed lateral stabilization; and incorporated FPV technology and video telemetry for operational efficiency.',
    tools: 'FPV technology, video telemetry, UAV design and fabrication methods, prototype testing, and lateral-stabilization analysis. Specific software is not named on the page.',
    result: 'The team achieved AIR #2. The project addressed medical payload delivery and applied aircraft stabilization and real-time visual/telemetry capabilities to a healthcare-oriented use case.',
    goals: 'Enhance an autonomous UAV for medical payload delivery, improve its stability and operational efficiency, and lead the team through fabrication and testing.',
    achievements: 'Led the project team, oversaw design enhancement and prototype testing, developed lateral stabilization, incorporated FPV/video telemetry, and achieved AIR #2.',
    skills: 'Technical leadership, UAV design, lateral stabilization, prototype fabrication, testing, FPV integration, video telemetry, teamwork, and healthcare-oriented engineering.',
    scope: 'Applications include medical-supply delivery, emergency response, and healthcare logistics. Future scope includes longer-range operation, improved payload reliability, stronger autonomy, and field deployment validation.',
  },
  {
    id: 'trakshya-drone', title: 'Trakshya', category: 'aerospace', categoryLabel: 'SAE India Aerothon 2024 / aeroKLE SAE Aero-Design Team', categoryDetail: 'SAE India Aerothon 2024 — aeroKLE SAE Aero-Design Team', image: 'Trakshya.jpg',
    description: 'A quad-X drone designed for aerodynamic efficiency, structural integrity, weight optimization, spatial balance, stability, maneuverability, and payload capacity.',
    contribution: 'Contributed to the design of Trakshya, including structural and aerodynamic decisions, component selection, avionics-bay and payload-system design, airflow management for ESC cooling, and a snap-fit removable avionics-bay cap.',
    tools: '3D-printed PLA, birch plywood, carbon fiber, quad-X configuration, NACA ducts, snap-fit design, and drone design/fabrication methods.',
    result: 'The aeroKLE SAE Aero-Design Team secured AIR #3 at Aerothon 2024. The design used PLA components, a birch-plywood mid-plate, a carbon-fiber bottom plate, NACA ducts for ESC cooling, and a removable cap to reduce drag and improve access.',
    goals: 'Develop a stable, maneuverable, lightweight, and payload-capable quad-X drone with balanced structure, efficient airflow, and accessible avionics packaging.',
    achievements: 'Helped deliver an AIR #3 result; contributed to a quad-X drone design; addressed ESC overheating with NACA ducts; and optimized the avionics bay for low drag and accessibility.',
    skills: 'Aerodynamic efficiency, structural design, weight optimization, spatial balancing, additive manufacturing, composite/material selection, thermal airflow management, and packaging design.',
    scope: 'Applications include competitive UAVs, payload-carrying drones, inspection, and field robotics. Future scope includes additional flight testing, greater payload efficiency, improved thermal management, and autonomous capability.',
  },
  {
    id: 'table-lamp', title: 'Table Lamp', category: 'design', categoryLabel: 'Design & Manufacturing / Additive Manufacturing', image: 'Table Lamp.jpg',
    description: 'A modified and 3D-printed lamp prototype demonstrating Design for Manufacturing principles and additive-manufacturing-based product development.',
    contribution: 'Modified the lamp prototype and selected the printing parameters and material strategy to balance appearance, structural form, and functional efficiency.',
    tools: '3D printing, ABS material, 150 mm/s print speed, 2 mm wall thickness, 60% infill density, and a 2D honeycomb infill pattern.',
    result: 'Produced a functional and aesthetically considered lamp prototype while demonstrating how design choices and additive-manufacturing parameters affect product realization.',
    goals: 'Apply Design for Manufacturing principles to create a practical lamp prototype through additive manufacturing while balancing aesthetics, strength, and print efficiency.',
    achievements: 'Modified and printed the prototype in ABS, used a honeycomb infill strategy, and demonstrated the practical application of DFM and 3D-printing parameters.',
    skills: 'Design for Manufacturing, additive manufacturing, 3D-printing parameter selection, product prototyping, material awareness, and creative engineering.',
    scope: 'Applications include customized lighting products, rapid prototyping, and small-batch product manufacturing. Future work can explore other materials, improved light diffusion, modular designs, and optimized print time and material usage.',
  },
].map((entry, index) => ({
  ...entry,
  coCurricular: true,
  displayIndex: index + 1,
  accent: index % 2 ? 'coral' : 'gold',
  tagline: entry.categoryLabel,
  card: entry.description,
  overview: entry.description,
  build: entry.contribution,
  learning: entry.scope,
  tools: entry.tools.split(', ').slice(0, 6),
  images: [entry.image],
  cover: entry.image,
  folder: ['Co-Curricular_Project_Photos', 'Co-Curricular_Project_Photos'],
  fullContent: [
    { type: 'heading', text: 'Project details' },
    { type: 'meta', text: `Category: ${entry.categoryDetail || entry.categoryLabel}` },
    { type: 'heading', text: 'Description' }, { type: 'paragraph', text: entry.description },
    { type: 'heading', text: 'Your contribution' }, { type: 'paragraph', text: entry.contribution },
    { type: 'heading', text: 'Tools used' }, { type: 'paragraph', text: entry.tools },
    { type: 'heading', text: 'Results' }, { type: 'paragraph', text: entry.result },
    { type: 'heading', text: 'Goals and Objectives' }, { type: 'paragraph', text: entry.goals },
    { type: 'heading', text: 'Key Achievements' }, { type: 'paragraph', text: entry.achievements },
    { type: 'heading', text: 'Key Skills Highlighted' }, { type: 'paragraph', text: entry.skills },
    { type: 'heading', text: 'Applications and Future Scope' }, { type: 'paragraph', text: entry.scope },
  ],
}));
projectData.push(...coCurricularEntries);

const grid = document.querySelector('#project-grid');
const featuredGrid = document.querySelector('#project-featured-grid');
const coCurricularGrid = document.querySelector('#cocurricular-grid');
const dialog = document.querySelector('#project-dialog');
const filters = [...document.querySelectorAll('.project-filter')];
let activeFilter = 'all';
let activeProject = null;
let activeImage = 0;
let lastTrigger = null;
let galleryTimer = null;

function assetUrl(project, file) {
  const folderSegments = Array.isArray(project.folder) ? project.folder : project.folder ? [project.folder] : [];
  const segments = [...folderSegments, file];
  if (location.protocol === 'file:') return ['Projects', 'photos', ...segments].map(encodeURIComponent).join('/');
  return `/api/projects/${segments.map(encodeURIComponent).join('/')}`;
}

function renderCards() {
  if (!grid) return;
  const regularProjects = projectData.filter((project) => !project.featured && !project.coCurricular);
  const featuredProjects = projectData.filter((project) => project.featured);
  const coCurricularProjects = projectData.filter((project) => project.coCurricular);
  const markup = (project, isFeatured = false) => `
    <button class="project-card${isFeatured ? ' project-card-featured' : ''} project-accent-${project.accent}" type="button" data-project="${project.id}" data-category="${project.category}" aria-label="Open ${project.title} project details">
      <span class="project-card-image"><img src="${assetUrl(project, project.cover)}" alt="${project.title} project" loading="${projectData.indexOf(project) < 3 || isFeatured ? 'eager' : 'lazy'}" decoding="async"><span class="project-card-open" aria-hidden="true">↗</span></span>
      <span class="project-card-meta"><span class="project-card-index">${project.displayIndex ? `CC ${String(project.displayIndex).padStart(2, '0')}` : String(projectData.indexOf(project) + 1).padStart(2, '0')}</span><span class="project-card-category">${project.categoryLabel}</span>${isFeatured ? '<span class="project-card-pin">PINNED</span>' : ''}</span>
      <span class="project-card-title">${project.title}</span>
      <span class="project-card-summary">${project.card}</span>
      <span class="project-card-bottom"><span>EXPLORE PROJECT</span><span aria-hidden="true">↗</span></span>
    </button>`;
  grid.innerHTML = regularProjects.map((project) => markup(project)).join('');
  if (featuredGrid) featuredGrid.innerHTML = featuredProjects.map((project) => markup(project, true)).join('');
  if (coCurricularGrid) coCurricularGrid.innerHTML = coCurricularProjects.map((project) => markup(project)).join('');
  [grid, featuredGrid, coCurricularGrid].filter(Boolean).forEach((container) => container.querySelectorAll('.project-card').forEach((card) => {
    const project = projectData.find((item) => item.id === card.dataset.project);
    card.addEventListener('click', () => openProject(card.dataset.project, card));
    if (project.images.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const image = card.querySelector('.project-card-image img');
      let imageIndex = 0;
      window.setInterval(() => {
        if (document.hidden || document.body.classList.contains('project-dialog-open') || card.matches(':hover, :focus-within')) return;
        imageIndex = (imageIndex + 1) % project.images.length;
        image.classList.add('is-transitioning');
        window.setTimeout(() => {
          image.src = assetUrl(project, project.images[imageIndex]);
          image.alt = `${project.title}, image ${imageIndex + 1} of ${project.images.length}`;
          requestAnimationFrame(() => image.classList.remove('is-transitioning'));
        }, 240);
      }, 4200);
    }
  }));
  applyFilter(activeFilter, false);
}

function applyFilter(filter, animate = true) {
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.project-card')];
  const before = new Map(cards.map((card) => [card, card.getBoundingClientRect()]));
  activeFilter = filter;
  cards.forEach((card) => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('is-filtered-out', !visible);
    card.setAttribute('aria-hidden', String(!visible));
    card.tabIndex = visible ? 0 : -1;
  });
  filters.forEach((button) => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  requestAnimationFrame(() => cards.filter((card) => !card.classList.contains('is-filtered-out')).forEach((card) => {
    const old = before.get(card);
    if (!old || old.width === 0) return;
    const now = card.getBoundingClientRect();
    const dx = old.left - now.left;
    const dy = old.top - now.top;
    if (dx || dy) card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: 680, easing: 'cubic-bezier(.22,1,.36,1)' });
  }));
}

function setGalleryImage(index) {
  if (!activeProject) return;
  const images = activeProject.images;
  activeImage = (index + images.length) % images.length;
  const filename = images[activeImage];
  const image = document.querySelector('#detail-image');
  image.src = assetUrl(activeProject, filename);
  image.alt = `${activeProject.title}, image ${activeImage + 1} of ${images.length}`;
  document.querySelector('#gallery-count').textContent = `${String(activeImage + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
  const thumbnails = document.querySelector('#dialog-thumbnails');
  thumbnails.innerHTML = images.map((file, imageIndex) => `<button type="button" class="dialog-thumbnail${imageIndex === activeImage ? ' is-current' : ''}" data-image-index="${imageIndex}" aria-label="Show project image ${imageIndex + 1}" aria-pressed="${imageIndex === activeImage}"><img src="${assetUrl(activeProject, file)}" alt="" loading="lazy"></button>`).join('');
  thumbnails.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => setGalleryImage(Number(button.dataset.imageIndex))));
}

function openProject(id, trigger) {
  activeProject = projectData.find((project) => project.id === id);
  if (!activeProject || !dialog) return;
  lastTrigger = trigger;
  document.querySelector('#detail-number').textContent = activeProject.displayIndex ? `CC ${String(activeProject.displayIndex).padStart(2, '0')}` : String(projectData.indexOf(activeProject) + 1).padStart(2, '0');
  document.querySelector('#detail-category').textContent = activeProject.categoryLabel.toUpperCase();
  document.querySelector('#detail-title').textContent = activeProject.title;
  document.querySelector('#detail-tagline').textContent = activeProject.tagline;
  document.querySelector('#detail-overview').textContent = activeProject.overview;
  document.querySelector('#detail-build').textContent = activeProject.build;
  document.querySelector('#detail-learning').textContent = activeProject.learning;
  document.querySelector('#detail-tools').innerHTML = activeProject.tools.map((tool) => `<span>${tool}</span>`).join('');
  const fullContent = document.querySelector('#detail-full-content');
  const hasFullContent = Array.isArray(activeProject.fullContent);
  fullContent.replaceChildren();
  fullContent.hidden = !hasFullContent;
  document.querySelector('#detail-tagline').hidden = hasFullContent;
  document.querySelector('#detail-overview').hidden = hasFullContent;
  dialog.querySelectorAll('.detail-section').forEach((section) => { section.hidden = hasFullContent; });
  if (hasFullContent) activeProject.fullContent.forEach((item) => {
    let element;
    if (item.type === 'heading') element = document.createElement('h3');
    else if (item.type === 'subheading') element = document.createElement('h4');
    else if (item.type === 'result') {
      element = document.createElement('p');
      element.className = 'full-content-result';
      const split = item.text.indexOf(':');
      if (split >= 0) {
        const label = document.createElement('strong');
        label.textContent = item.text.slice(0, split + 1);
        element.append(label, document.createTextNode(item.text.slice(split + 1)));
      } else element.textContent = item.text;
    } else {
      element = document.createElement('p');
      element.className = item.type === 'meta' ? 'full-content-meta' : item.type === 'tools' ? 'full-content-tools' : '';
      element.textContent = item.text;
    }
    if (item.type === 'heading') {
      element.className = 'full-content-heading';
      element.textContent = item.text;
    }
    if (item.type === 'subheading') {
      element.className = 'full-content-subheading';
      element.textContent = item.text;
    }
    fullContent.append(element);
  });
  setGalleryImage(0);
  dialog.showModal();
  document.body.classList.add('project-dialog-open');
  document.querySelector('.dialog-close').focus();
  window.clearInterval(galleryTimer);
  if (activeProject.images.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    galleryTimer = window.setInterval(() => {
      if (dialog.open && !document.hidden) setGalleryImage(activeImage + 1);
    }, 4800);
  }
}

function closeProject() {
  window.clearInterval(galleryTimer);
  galleryTimer = null;
  if (dialog?.open) dialog.close();
  document.body.classList.remove('project-dialog-open');
  lastTrigger?.focus();
}

filters.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
document.querySelector('.dialog-close')?.addEventListener('click', closeProject);
dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeProject(); });
dialog?.addEventListener('close', () => document.body.classList.remove('project-dialog-open'));
document.querySelector('#gallery-prev')?.addEventListener('click', () => setGalleryImage(activeImage - 1));
document.querySelector('#gallery-next')?.addEventListener('click', () => setGalleryImage(activeImage + 1));
document.addEventListener('keydown', (event) => {
  if (!dialog?.open) return;
  if (event.key === 'ArrowLeft') setGalleryImage(activeImage - 1);
  if (event.key === 'ArrowRight') setGalleryImage(activeImage + 1);
});

renderCards();
})();

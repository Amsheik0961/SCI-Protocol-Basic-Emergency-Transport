window.SCI_PROTOCOL_DATA = {
  appMeta: {
    title: "SCI Protocol App",
    version: "2.1.0",
    storageKey: "sci_protocol_state_v2"
  },

  clinicalMeta: {
    notice:
      "Decision-support only. Does not replace clinician judgment, local policy, specialist consultation, or transport system protocols.",
    wsesTargets: {
      mapGoal: ">85 mmHg",
      hbTrigger: "<7 g/dL",
      pao2Goal: "60-100 mmHg",
      paco2Goal: "35-40 mmHg",
      plateletsHemorrhage: ">50,000/mm3",
      plateletsSurgery: "75,000-100,000/mm3",
      coagulationGoal: "PT/aPTT <1.5 x normal",
      surgeryTiming: "Urgent decompression/stabilization, preferably within 24 h",
      corticosteroids: "Avoid high-dose corticosteroid therapy in tSCI polytrauma",
      dvt: "Intermittent pneumatic compression as soon as feasible"
    }
  },

  protocols: [
    {
      id: "prehospital-basic",
      category: "Prehospital Care",
      title: "Basic Emergency Transport",
      scenarioLabel: "Basic transport",
      entryNodeId: "bet-001",
      description:
        "Algorithm for management of an adult with suspected spinal trauma in a Basic Emergency Transport setting.",
      sourceLabel: "BOOTStrap-SCI Basic Emergency Transport",
      pearls: [
        "Follow scene safety first, then xABCDE, then transport reassessment.",
        "Use jaw thrust rather than head tilt/chin lift in suspected spinal trauma.",
        "Neurologic deficit, TBI, or persistent instability should trigger urgent escalation or transfer."
      ],

      nodes: [
        {
          id: "bet-001",
          title: "Accident / trauma",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Adult patient with suspected spinal trauma enters the Basic Emergency Transport pathway.",
          actions: ["Begin structured spinal trauma assessment."],
          options: [
            {
              label: "Start",
              hint: "Proceed to scene safety",
              next: "bet-002"
            }
          ]
        },

        {
          id: "bet-002",
          title: "Assess scene safety",
          urgency: "Urgent",
          complexity: "Low",
          narrative:
            "Assess whether the scene is safe before continuing patient care.",
          actions: ["Check for biologic and physical hazards."],
          options: [
            {
              label: "Scene safe",
              hint: "Proceed to trauma kinematics",
              next: "bet-004"
            },
            {
              label: "Scene unsafe",
              hint: "Reduce biologic and physical risks first",
              next: "bet-003"
            }
          ]
        },

        {
          id: "bet-003",
          title: "Reduce biologic and physical risks at scene",
          urgency: "Urgent",
          complexity: "Low",
          narrative:
            "Mitigate immediate scene hazards before resuming trauma assessment.",
          actions: ["Reduce biologic and physical risks at the scene."],
          options: [
            {
              label: "Risks reduced",
              hint: "Proceed to trauma kinematics",
              next: "bet-004"
            }
          ]
        },

        {
          id: "bet-004",
          title: "Establish trauma kinematics",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Establish the mechanism of trauma to estimate spinal injury risk and severity.",
          actions: ["Identify major trauma mechanism."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to exsanguination assessment",
              next: "bet-005"
            }
          ]
        },

        {
          id: "bet-005",
          title: "Are there severe active bleeds?",
          urgency: "Urgent",
          complexity: "Low",
          narrative:
            "Immediately determine whether severe active bleeding is present.",
          alerts: ["Life-threatening bleeding control takes priority."],
          options: [
            {
              label: "Yes",
              hint: "Apply direct pressure and tourniquet if indicated",
              next: "bet-006"
            },
            {
              label: "No",
              hint: "Proceed to consciousness assessment",
              next: "bet-009"
            }
          ]
        },

        {
          id: "bet-006",
          title:
            "Apply direct pressure with sterile bandages and tourniquet if indicated",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "Control severe bleeding using direct pressure, sterile bandages, and tourniquet if indicated.",
          actions: [
            "Apply direct pressure.",
            "Use sterile bandages.",
            "Use tourniquet if indicated."
          ],
          options: [
            {
              label: "Bleeding reassessed",
              hint: "Check whether bleeding has stopped",
              next: "bet-007"
            }
          ]
        },

        {
          id: "bet-007",
          title: "Has bleeding stopped?",
          urgency: "Urgent",
          complexity: "Low",
          narrative:
            "Reassess the bleeding response after initial hemorrhage control.",
          options: [
            {
              label: "Yes",
              hint: "Proceed to airway section",
              next: "bet-009"
            },
            {
              label: "No",
              hint: "Apply hemostatic agents",
              next: "bet-008"
            }
          ]
        },

        {
          id: "bet-008",
          title: "Apply hemostatic agents",
          urgency: "Urgent",
          complexity: "High",
          narrative:
            "If severe bleeding persists despite direct pressure and bandaging, apply hemostatic agents when available.",
          actions: [
            "Apply hemostatic agents.",
            "Reassess control of bleeding."
          ],
          options: [
            {
              label: "Continue",
              hint: "Proceed to airway section",
              next: "bet-009"
            }
          ]
        },

        {
          id: "bet-009",
          title: "Assess level of consciousness via AVPU",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Assess level of consciousness using AVPU: Alert, Verbal, Pain, Unresponsive.",
          actions: ["Document AVPU level."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to responsiveness check",
              next: "bet-010"
            }
          ]
        },

        {
          id: "bet-010",
          title: "Is the patient responsive?",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Determine whether the patient is responsive before airway intervention.",
          options: [
            {
              label: "Yes",
              hint: "Check whether the airway is patent",
              next: "bet-011"
            },
            {
              label: "No",
              hint: "Perform jaw thrust maneuver",
              next: "bet-012"
            }
          ]
        },

        {
          id: "bet-012",
          title: "Jaw thrust maneuver",
          urgency: "Urgent",
          complexity: "Low",
          narrative:
            "Use jaw thrust to open the airway while minimizing cervical motion.",
          actions: ["Perform jaw thrust maneuver."],
          options: [
            {
              label: "Continue",
              hint: "Reassess airway patency",
              next: "bet-011"
            }
          ]
        },

        {
          id: "bet-011",
          title: "Is the airway patent?",
          urgency: "Urgent",
          complexity: "Low",
          narrative: "Determine whether the airway is patent.",
          options: [
            {
              label: "Yes",
              hint: "Assess for possible cervical injury",
              next: "bet-014"
            },
            {
              label: "No",
              hint: "Establish airway patency with available tools",
              next: "bet-013"
            }
          ]
        },

        {
          id: "bet-013",
          title: "Establish airway patency with available tools",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "Use available airway tools to establish airway patency in the basic transport environment.",
          actions: ["Use locally available airway adjuncts."],
          options: [
            {
              label: "Continue",
              hint: "Assess for possible cervical injury",
              next: "bet-014"
            }
          ]
        },

        {
          id: "bet-014",
          title: "Is there a possible cervical injury?",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Check for focal neurologic deficits, midline spine tenderness, altered level of consciousness, intoxication, painful distracting injury, or major trauma mechanism.",
          alerts: ["Suspect cervical injury if any screening feature is present."],
          actions: [
            "Check for focal neurologic deficits.",
            "Check for midline spine tenderness.",
            "Check for altered level of consciousness.",
            "Check for intoxication.",
            "Check for painful distracting injury.",
            "Check for major trauma mechanism."
          ],
          options: [
            {
              label: "Yes",
              hint: "Assess for penetrating neck injury",
              next: "bet-015"
            },
            {
              label: "No",
              hint: "Proceed to breathing assessment",
              next: "bet-018"
            }
          ]
        },

        {
          id: "bet-015",
          title: "Is there a penetrating neck injury?",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "If cervical injury is suspected, determine whether a penetrating neck injury is present.",
          options: [
            {
              label: "Yes",
              hint: "Manually immobilize cervical spine",
              next: "bet-016"
            },
            {
              label: "No",
              hint: "Immobilize cervical spine using a hard cervical collar",
              next: "bet-017"
            }
          ]
        },

        {
          id: "bet-016",
          title: "Manually immobilize cervical spine",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Use manual cervical immobilization for penetrating neck injury.",
          actions: ["Maintain manual cervical spine immobilization."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to breathing assessment",
              next: "bet-018"
            }
          ]
        },

        {
          id: "bet-017",
          title: "Immobilize cervical spine using a hard cervical collar",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Use a hard cervical collar when cervical spine injury is suspected and there is no penetrating neck injury.",
          actions: ["Apply hard cervical collar."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to breathing assessment",
              next: "bet-018"
            }
          ]
        },

        {
          id: "bet-018",
          title: "Measure respiratory rate",
          urgency: "Urgent",
          complexity: "Low",
          narrative:
            "Measure respiratory rate as the first breathing assessment step.",
          actions: ["Count respiratory rate."],
          options: [
            {
              label: "Continue",
              hint: "Measure oxygen saturation if available",
              next: "bet-019"
            }
          ]
        },

        {
          id: "bet-019",
          title: "Measure SpO2 via pulse oximetry",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Measure oxygen saturation via pulse oximeter if available.",
          actions: ["Measure SpO2 using pulse oximetry."],
          options: [
            {
              label: "Continue",
              hint: "Assess for respiratory compromise",
              next: "bet-020"
            }
          ]
        },

        {
          id: "bet-020",
          title: "Respiratory rate <10 or >30 breaths per minute and/or SpO2 <90%?",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "Identify respiratory compromise using respiratory rate and oxygen saturation thresholds.",
          options: [
            {
              label: "Yes",
              hint: "Provide BVM ventilations and oxygen",
              next: "bet-021"
            },
            {
              label: "No",
              hint: "Repeat respiratory checks every 5 minutes",
              next: "bet-023"
            }
          ]
        },

        {
          id: "bet-021",
          title:
            "Perform 10–20 ventilations with BVM or ambu bag and supplementary O2 to maintain SpO2 >94%",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "Use bag-valve-mask or ambu bag with supplemental oxygen to maintain oxygen saturation above 94%.",
          actions: [
            "Provide 10–20 ventilations with BVM or ambu bag.",
            "Give supplemental oxygen."
          ],
          options: [
            {
              label: "BVM or ambu bag available",
              hint: "Continue respiratory reassessment",
              next: "bet-023"
            },
            {
              label: "No BVM or ambu bag available",
              hint: "Continue jaw thrust maneuver",
              next: "bet-022"
            }
          ]
        },

        {
          id: "bet-022",
          title: "Continue jaw thrust maneuver",
          urgency: "Urgent",
          complexity: "Low",
          narrative:
            "If BVM or ambu bag is unavailable, maintain airway support with ongoing jaw thrust.",
          actions: ["Continue jaw thrust maneuver."],
          options: [
            {
              label: "Continue",
              hint: "Repeat respiratory checks",
              next: "bet-023"
            }
          ]
        },

        {
          id: "bet-023",
          title: "Check respiratory rate and SpO2 every 5 minutes",
          urgency: "High",
          complexity: "Low",
          narrative: "Repeat respiratory monitoring every 5 minutes.",
          actions: [
            "Repeat respiratory rate.",
            "Repeat SpO2 if available."
          ],
          options: [
            {
              label: "Continue",
              hint: "Inspect the neck and thorax",
              next: "bet-024"
            }
          ]
        },

        {
          id: "bet-024",
          title: "Inspect, auscultate, and palpate neck and thorax",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Inspect, auscultate, and palpate the neck and thorax for major chest injury.",
          actions: [
            "Inspect the neck and thorax.",
            "Auscultate if possible.",
            "Palpate for injury."
          ],
          options: [
            {
              label: "Continue",
              hint: "Assess for major thoracic emergency",
              next: "bet-025"
            }
          ]
        },

        {
          id: "bet-025",
          title: "Signs of tension, open, massive, or cardiac pneumothorax?",
          urgency: "Urgent",
          complexity: "High",
          narrative:
            "Determine whether signs suggest a major thoracic emergency.",
          options: [
            {
              label: "Yes",
              hint: "Escalate to Advanced Emergency Transport protocol",
              next: "bet-026"
            },
            {
              label: "No",
              hint: "Proceed to circulation assessment",
              next: "bet-027"
            }
          ]
        },

        {
          id: "bet-026",
          title: "See Advanced Emergency Transport protocol",
          urgency: "Urgent",
          complexity: "High",
          narrative:
            "A major thoracic emergency requires escalation beyond the basic transport algorithm.",
          actions: [
            "Escalate to advanced transport protocol if capability exists."
          ],
          options: [
            {
              label: "Advanced care available",
              hint: "Exit basic pathway and escalate",
              next: null
            },
            {
              label: "No equipment or expertise available",
              hint: "Organize transfer to nearest Emergency Department",
              next: "bet-050"
            }
          ]
        },

        {
          id: "bet-027",
          title: "Check circulatory signs",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "Assess capillary refill time, skin color, and radial pulse or non-invasive arterial blood pressure.",
          actions: [
            "Check capillary refill time.",
            "Check skin color.",
            "Check radial pulse or non-invasive arterial pressure."
          ],
          options: [
            {
              label: "Continue",
              hint: "Assess capillary refill branch",
              next: "bet-028"
            }
          ]
        },

        {
          id: "bet-028",
          title: "Normal capillary refill time (<2 seconds)?",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Use capillary refill as one branch of circulation evaluation.",
          options: [
            {
              label: "Yes",
              hint: "Start maintenance fluids",
              next: "bet-029"
            },
            {
              label: "No",
              hint: "Give crystalloid bolus",
              next: "bet-030"
            }
          ]
        },

        {
          id: "bet-029",
          title: "Start maintenance fluids at 0.5–1 cc/kg/h",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "If circulation appears adequate, start maintenance fluids using normal saline or lactated Ringer's.",
          actions: [
            "Start maintenance fluids at 0.5–1 cc/kg/h.",
            "Use normal saline or lactated Ringer's."
          ],
          options: [
            {
              label: "Continue",
              hint: "Assess skin color branch",
              next: "bet-031"
            }
          ]
        },

        {
          id: "bet-030",
          title: "Give bolus of 3–4 cc/kg crystalloid fluid",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "If capillary refill is abnormal, give a crystalloid bolus using normal saline or lactated Ringer's.",
          actions: [
            "Give bolus of 3–4 cc/kg crystalloid fluid.",
            "Use normal saline or lactated Ringer's."
          ],
          options: [
            {
              label: "Continue",
              hint: "Assess skin color branch",
              next: "bet-031"
            }
          ]
        },

        {
          id: "bet-031",
          title: "Normal skin color (no pallor, no sweating, no coldness)?",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Use skin color and perfusion appearance as the second circulation branch.",
          options: [
            {
              label: "Yes",
              hint: "Start maintenance fluids",
              next: "bet-032"
            },
            {
              label: "No",
              hint: "Give crystalloid bolus",
              next: "bet-033"
            }
          ]
        },

        {
          id: "bet-032",
          title: "Start maintenance fluids based on skin color branch",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "If skin color suggests adequate perfusion, continue maintenance fluids.",
          actions: [
            "Start maintenance fluids at 0.5–1 cc/kg/h using normal saline or lactated Ringer's."
          ],
          options: [
            {
              label: "Continue",
              hint: "Assess pulse / SBP branch",
              next: "bet-034"
            }
          ]
        },

        {
          id: "bet-033",
          title: "Give crystalloid bolus based on skin color branch",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "If skin color is abnormal, give a 3–4 cc/kg crystalloid bolus.",
          actions: ["Give 3–4 cc/kg crystalloid bolus."],
          options: [
            {
              label: "Continue",
              hint: "Assess pulse / SBP branch",
              next: "bet-034"
            }
          ]
        },

        {
          id: "bet-034",
          title: "Present radial pulse and SBP ≥90 mmHg?",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Use radial pulse presence and systolic blood pressure threshold as the third circulation branch.",
          options: [
            {
              label: "Yes",
              hint: "Start maintenance fluids",
              next: "bet-035"
            },
            {
              label: "No",
              hint: "Give crystalloid bolus",
              next: "bet-036"
            }
          ]
        },

        {
          id: "bet-035",
          title: "Start maintenance fluids based on pulse / SBP branch",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "If radial pulse is present and systolic blood pressure is at least 90 mmHg, continue maintenance fluids.",
          actions: ["Start maintenance fluids at 0.5–1 cc/kg/h."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to disability assessment",
              next: "bet-037"
            }
          ]
        },

        {
          id: "bet-036",
          title: "Give crystalloid bolus based on pulse / SBP branch",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "If radial pulse is absent or systolic blood pressure is below 90 mmHg, give 3–4 cc/kg crystalloid bolus.",
          alerts: [
            "If the patient continues to be unstable, repeat the crystalloid bolus as needed."
          ],
          actions: [
            "Give 3–4 cc/kg crystalloid bolus.",
            "Repeat bolus if instability persists."
          ],
          options: [
            {
              label: "Continue",
              hint: "Proceed to disability assessment",
              next: "bet-037"
            }
          ]
        },

        {
          id: "bet-037",
          title: "Traumatic brain injury present?",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Before focused neurological reassessment, determine whether traumatic brain injury is present.",
          options: [
            {
              label: "Yes",
              hint: "Refer to BOOTStrap TBI protocol",
              next: "bet-038"
            },
            {
              label: "No",
              hint: "Measure blood glucose",
              next: "bet-039"
            }
          ]
        },

        {
          id: "bet-038",
          title: "Refer to BOOTStrap TBI protocol",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Presence of traumatic brain injury requires TBI-specific protocol review.",
          actions: ["Refer to BOOTStrap TBI protocol."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to blood glucose check",
              next: "bet-039"
            }
          ]
        },

        {
          id: "bet-039",
          title: "Measure blood glucose",
          urgency: "High",
          complexity: "Low",
          narrative: "Check blood glucose during disability evaluation.",
          actions: ["Measure blood glucose."],
          options: [
            {
              label: "Continue",
              hint: "Assess whether blood glucose is low",
              next: "bet-040"
            }
          ]
        },

        {
          id: "bet-040",
          title: "Blood glucose <110 mg/dL?",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Determine whether blood glucose is below the threshold shown in the algorithm.",
          options: [
            {
              label: "Yes",
              hint: "Administer glucose",
              next: "bet-041"
            },
            {
              label: "No",
              hint: "Reassess consciousness",
              next: "bet-042"
            }
          ]
        },

        {
          id: "bet-041",
          title: "Administer 15–20 g of glucose",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "If blood glucose is below threshold, administer 15–20 g of glucose.",
          actions: ["Administer 15–20 g of glucose."],
          options: [
            {
              label: "Continue",
              hint: "Reassess consciousness",
              next: "bet-042"
            }
          ]
        },

        {
          id: "bet-042",
          title: "Re-assess level of consciousness via AVPU scale",
          urgency: "High",
          complexity: "Low",
          narrative: "Repeat level of consciousness assessment using AVPU.",
          actions: ["Repeat AVPU assessment."],
          options: [
            {
              label: "Continue",
              hint: "Perform focused sensorimotor exam",
              next: "bet-043"
            }
          ]
        },

        {
          id: "bet-043",
          title: "Conduct focused sensorimotor exam",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Perform a focused sensorimotor exam, checking upper extremity flexion/extension, lower extremity flexion/extension, and sensation by dermatome at C4, T4, T10, S1, and L1.",
          actions: [
            "Check upper extremity flexion and extension.",
            "Check lower extremity flexion and extension.",
            "Check sensation by dermatome at C4, T4, T10, S1, and L1."
          ],
          options: [
            {
              label: "Continue",
              hint: "Assess whether deficit is present",
              next: "bet-044"
            }
          ]
        },

        {
          id: "bet-044",
          title: "Deficit present?",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Determine whether the focused sensorimotor exam shows a neurologic deficit.",
          options: [
            {
              label: "Yes",
              hint: "Repeat neurologic exam every 5 minutes",
              next: "bet-045"
            },
            {
              label: "No",
              hint: "Repeat neurologic exam every 15 minutes",
              next: "bet-046"
            }
          ]
        },

        {
          id: "bet-045",
          title: "Repeat neurologic exam every 5 minutes",
          urgency: "High",
          complexity: "Low",
          narrative:
            "When neurologic deficit is present, repeat neurologic exam every 5 minutes.",
          actions: ["Repeat neurologic exam every 5 minutes."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to transport planning",
              next: "bet-047"
            }
          ]
        },

        {
          id: "bet-046",
          title: "Repeat neurologic exam every 15 minutes",
          urgency: "High",
          complexity: "Low",
          narrative:
            "When no neurologic deficit is present, repeat neurologic exam every 15 minutes.",
          actions: ["Repeat neurologic exam every 15 minutes."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to transport planning",
              next: "bet-047"
            }
          ]
        },

        {
          id: "bet-047",
          title:
            "Transfer the patient to the nearest center with adequate equipment and expertise for their condition",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Plan transport toward the nearest appropriate center with adequate equipment and expertise.",
          actions: ["Transfer to the nearest appropriate center."],
          options: [
            {
              label: "Continue",
              hint: "Assess hemodynamic stability",
              next: "bet-048"
            }
          ]
        },

        {
          id: "bet-048",
          title: "Is the patient hemodynamically unstable?",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "Check for persistent absent radial pulse, cyanosis, or respiratory rate below 10 or above 30 despite treatment.",
          actions: [
            "Check for persistently absent radial pulse.",
            "Check for cyanosis.",
            "Check for respiratory rate <10 or >30 despite treatment."
          ],
          options: [
            {
              label: "Yes",
              hint: "Transfer to nearest Emergency Room for stabilization",
              next: "bet-049"
            },
            {
              label: "No",
              hint: "Assess for TBI or abnormal sensorimotor exam",
              next: "bet-051"
            }
          ]
        },

        {
          id: "bet-049",
          title: "Transfer patient to nearest Emergency Room for stabilization",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "If the patient is hemodynamically unstable, transfer to the nearest Emergency Room for stabilization.",
          actions: ["Transfer to nearest ER for stabilization."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to transport reassessment",
              next: "bet-052"
            }
          ]
        },

        {
          id: "bet-050",
          title: "Organize transfer to nearest Emergency Department",
          urgency: "Urgent",
          complexity: "Medium",
          narrative:
            "If advanced transport capability is unavailable, organize transfer to the nearest Emergency Department.",
          actions: ["Organize transfer to nearest Emergency Department."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to transport reassessment",
              next: "bet-052"
            }
          ]
        },

        {
          id: "bet-051",
          title: "TBI or abnormal sensorimotor exam?",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Determine whether traumatic brain injury or abnormal neurologic findings are present after stabilization review.",
          options: [
            {
              label: "Yes",
              hint: "Transfer to advanced care management facility",
              next: "bet-053"
            },
            {
              label: "No",
              hint: "Transfer to nearest Emergency Room",
              next: "bet-054"
            }
          ]
        },

        {
          id: "bet-053",
          title: "Transfer patient to advanced care management facility (CT, neurosurgery, ICU)",
          urgency: "High",
          complexity: "High",
          narrative:
            "Transfer to a higher-capability facility when TBI or abnormal sensorimotor exam is present.",
          actions: ["Transfer to facility with CT, neurosurgery, and ICU capability."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to transport reassessment",
              next: "bet-052"
            }
          ]
        },

        {
          id: "bet-054",
          title: "Transfer patient to nearest Emergency Room",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Transfer to the nearest Emergency Room when advanced-care indications are absent.",
          actions: ["Transfer to nearest Emergency Room."],
          options: [
            {
              label: "Continue",
              hint: "Proceed to transport reassessment",
              next: "bet-052"
            }
          ]
        },

        {
          id: "bet-052",
          title: "During transport: reevaluate patient and recheck motion restriction",
          urgency: "High",
          complexity: "Low",
          narrative:
            "During transport, reevaluate the patient and recheck motion restriction.",
          actions: [
            "Reevaluate patient during transport.",
            "Recheck motion restriction."
          ],
          options: [
            {
              label: "Continue",
              hint: "Assess whether neurologic abnormalities are present",
              next: "bet-055"
            }
          ]
        },

        {
          id: "bet-055",
          title: "Are neurologic abnormalities present?",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "Check for neurologic deficit, midline spine tenderness, altered level of consciousness, intoxication, or painful distracting injury.",
          actions: [
            "Check for neurologic deficit.",
            "Check for midline spine tenderness.",
            "Check for altered level of consciousness.",
            "Check for intoxication.",
            "Check for painful distracting injury."
          ],
          options: [
            {
              label: "Yes",
              hint: "Verify proper cervical immobilization",
              next: "bet-056"
            },
            {
              label: "No",
              hint: "Reevaluate all previous steps every 15 minutes",
              next: "bet-059"
            }
          ]
        },

        {
          id: "bet-056",
          title: "Verify proper application of hard cervical collar",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "When neurologic abnormalities are present, verify proper application of the hard cervical collar.",
          actions: ["Verify proper application of hard cervical collar."],
          options: [
            {
              label: "Hard collar available",
              hint: "Reevaluate all previous steps every 5 minutes",
              next: "bet-058"
            },
            {
              label: "Hard cervical collar unavailable",
              hint: "Verify manual restriction and padded long backboard",
              next: "bet-057"
            }
          ]
        },

        {
          id: "bet-057",
          title: "Verify manual restriction and padded long backboard",
          urgency: "High",
          complexity: "Medium",
          narrative:
            "If a hard cervical collar is unavailable, verify manual restriction and padded long backboard use.",
          actions: [
            "Verify manual restriction.",
            "Verify padded long backboard use."
          ],
          options: [
            {
              label: "Continue",
              hint: "Reevaluate all previous steps every 5 minutes",
              next: "bet-058"
            }
          ]
        },

        {
          id: "bet-058",
          title: "Reevaluate all previous steps every 5 minutes",
          urgency: "High",
          complexity: "Low",
          narrative:
            "When neurologic abnormalities are present, reevaluate all previous steps every 5 minutes.",
          actions: ["Repeat prior checks every 5 minutes."],
          options: [
            {
              label: "Continue",
              hint: "Take relevant clinical and medical history",
              next: "bet-060"
            }
          ]
        },

        {
          id: "bet-059",
          title: "Reevaluate all previous steps every 15 minutes",
          urgency: "High",
          complexity: "Low",
          narrative:
            "If neurologic abnormalities are not present, reevaluate all previous steps every 15 minutes.",
          actions: ["Repeat prior checks every 15 minutes."],
          options: [
            {
              label: "Continue",
              hint: "Take relevant clinical and medical history",
              next: "bet-060"
            }
          ]
        },

        {
          id: "bet-060",
          title: "Take relevant clinical and medical history",
          urgency: "High",
          complexity: "Low",
          narrative:
            "Obtain relevant clinical and medical history during ongoing transport care.",
          actions: ["Take relevant clinical and medical history."],
          options: [
            {
              label: "End protocol",
              hint: "Continue transport and handoff",
              next: null
            }
          ]
        }
      ]
    }
  ]
};
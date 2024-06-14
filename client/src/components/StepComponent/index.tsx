import React, { useState } from 'react';
import { Steps, Button, Modal } from 'antd';

const { Step } = Steps;

interface StepComponentProps {
    onFinish: (interest: string, department: string) => void;
    visible: boolean;
    onClose: () => void;
}

const StepComponent: React.FC<StepComponentProps> = ({ onFinish, visible, onClose }) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [interest, setInterest] = useState<string>('');
    const [department, setDepartment] = useState<string>('');

    const handleInterestSelect = (interest: string) => {
        setInterest(interest);
        setCurrentStep(prevStep => prevStep + 1); // Move to step 1: choosing department
    };

    const handleDepartmentSelect = (dept: string) => {
        setDepartment(dept);
        onFinish(interest, dept); // Using interest directly here
    };

    const steps = [
        {
            title: 'Choose Your Interest',
            content: (
                <div>
                    <h2>Choose Your Interest</h2>
                    <Button type="primary" onClick={() => handleInterestSelect('Computer Science')}>
                        Computer Science
                    </Button>
                    <Button type="primary" onClick={() => handleInterestSelect('Electrical Engineering')}>
                        Electrical Engineering
                    </Button>
                    {/* Add more interest options as needed */}
                </div>
            ),
        },
        {
            title: 'Choose Your Department',
            content: (
                <div>
                    <h2>Choose Your Department</h2>
                    {interest === 'Computer Science' && (
                        <Button type="primary" onClick={() => handleDepartmentSelect('Computer Science')}>
                            Computer Science Department
                        </Button>
                    )}
                    {interest === 'Electrical Engineering' && (
                        <Button type="primary" onClick={() => handleDepartmentSelect('Electrical Engineering')}>
                            Electrical Engineering Department
                        </Button>
                    )}
                    {/* Add more department options as needed */}
                </div>
            ),
        },
    ];

    return (
        <Modal
            title="Choose Interest and Department"
            visible={visible}
            onCancel={onClose}
            footer={[
                currentStep > 0 && (
                    <Button key="back" onClick={() => setCurrentStep(currentStep - 1)}>
                        Previous
                    </Button>
                ),
                currentStep < steps.length - 1 && (
                    <Button key="next" type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                        Next
                    </Button>
                ),
                currentStep === steps.length - 1 && (
                    <Button key="done" type="primary" onClick={() => onFinish(interest, department)}>
                        Done
                    </Button>
                ),
            ]}
        >
            <Steps current={currentStep}>
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                ))}
            </Steps>
            <div className="steps-content" style={{ marginTop: '20px' }}>
                {steps[currentStep] && steps[currentStep]?.content}
            </div>
        </Modal>
    );
};

export default StepComponent;

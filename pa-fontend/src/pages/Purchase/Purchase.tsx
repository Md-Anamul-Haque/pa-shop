import PurchesVendorInfo_input from "@/components/component/purchase/purches&VendorInfo_input";
import PurchesHandler from "@/components/component/purchase/purches-handler";
import { purchaseSlice, useDispatch } from "@/lib/redux";
import { supplierType } from "@/types/tables.type";
import { Step, StepLabel, Stepper } from "@mui/material";
// import { Input } from "@/components/ui/input";
import { useState } from "react";
const steps = [
    'Select supplier',
    'makes lists',
];

const Purchase = () => {
    const [activeStep, setActiveStep] = useState(0);
    // const { supplier, purchaseDts } = useSelector(selectPurchase);
    const dispatch = useDispatch();

    const setSupplier = (supplier: supplierType) => {
        dispatch(purchaseSlice.actions.setSupplier(supplier));
    };
    return (
        <div className="my-5 grid w-full">
            <div className="">
                <Stepper activeStep={activeStep}>
                    {steps.map((label, i) => (
                        <Step key={label}>
                            <StepLabel>
                                {activeStep == i ? <span className="hidden sm:inline-block">{label}</span> : <span className="hidden md:inline-block">{label}</span>}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            {activeStep === 0 && <PurchesVendorInfo_input onSaveChange={setSupplier} onNext={incre => setActiveStep(activeStep + incre)} />}
            {activeStep === 1
                && <div className="w-full h-full overflow-auto flex">
                    <div className="hidden lg:inline-block mr-20 bg-slate-500  w-52">

                    </div>
                    <PurchesHandler
                        onSubmited={() => {
                            dispatch(purchaseSlice.actions.clearPurchase())
                            setActiveStep(0)
                        }}
                        onNext={incre => setActiveStep(activeStep + incre)} />
                    <div className="hidden lg:inline-block w-44">

                    </div>
                </div>}
        </div>
    )
}
export default Purchase;

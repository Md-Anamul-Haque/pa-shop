import PurchesVendorInfo_inputMobile from "@/components/component/purchase/purches&VendorInfo_inputMobile";
import PurchesList from "@/components/component/purchase/purchesList";
import { purchaseSlice, useDispatch } from "@/lib/redux";
import { purchaseDetailType, supplierType } from "@/types/tables.type";
import { Step, StepLabel, Stepper } from "@mui/material";
// import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
const steps = [
    'Select supplier',
    'Create an ad group',
    'Create an ad',
];

const Purchase = () => {
    const [activeStep, setActiveStep] = useState(0);
    // const { supplier, purchaseDts } = useSelector(selectPurchase);
    const dispatch = useDispatch()
    useEffect(() => {

    }, [])
    const setSupplier = (supplier: supplierType) => {
        dispatch(purchaseSlice.actions.setSupplier(supplier));
    };
    return (
        <div className="my-5 grid space-y-9">
            <div className="overflow-auto">
                <Stepper activeStep={activeStep}>
                    {steps.map((label, i) => (
                        <Step key={label}>
                            <StepLabel onClick={() => setActiveStep(i)}>
                                {activeStep == i ? <span className="hidden sm:inline-block">{label}</span> : <span className="hidden md:inline-block">{label}</span>}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <Screen onNext={(s) => {
                setSupplier(s)
                setActiveStep(activeStep + 1)
            }} active_index={activeStep} />
        </div>
    )
}
export default Purchase

const Screen = ({ active_index, onNext }: { active_index: number, supplier?: supplierType; purchaseDts?: purchaseDetailType[]; onNext: (supplier: supplierType) => void }) => {
    switch (active_index) {
        case 1:
            return (
                <div className="w-full h-full flex">
                    <div className=" mr-20 bg-slate-500 animate-pulse  w-52">

                    </div>
                    <PurchesList />
                    <div className=" ml-20 bg-purple-500 animate-pulse  w-52">

                    </div>
                </div>
            )
            break;

        default:
            return (
                <PurchesVendorInfo_inputMobile onNext={onNext} />
            )
            break;
    }
}

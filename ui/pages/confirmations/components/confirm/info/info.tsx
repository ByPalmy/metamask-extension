import { TransactionType } from '@metamask/transaction-controller';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { currentConfirmationSelector } from '../../../../../selectors';
import { SignatureRequestType } from '../../../types/confirm';
import ContractInteractionInfo from './contract-interaction/contract-interaction';
import PersonalSignInfo from './personal-sign/personal-sign';
import TypedSignV1Info from './typed-sign-v1/typed-sign-v1';
import TypedSignInfo from './typed-sign/typed-sign';
import ApproveInfo from './approve/approve';

const Info = () => {
  const currentConfirmation = useSelector(currentConfirmationSelector);

  const ConfirmationInfoComponentMap = useMemo(
    () => ({
      [TransactionType.personalSign]: () => PersonalSignInfo,
      [TransactionType.signTypedData]: () => {
        const { version } =
          (currentConfirmation as SignatureRequestType)?.msgParams ?? {};
        if (version === 'V1') {
          return TypedSignV1Info;
        }
        return TypedSignInfo;
      },
      [TransactionType.contractInteraction]: () => ContractInteractionInfo,
      [TransactionType.tokenMethodApprove]: () => ApproveInfo,
    }),
    [currentConfirmation],
  );

  if (!currentConfirmation?.type) {
    return null;
  }

  const InfoComponent =
    ConfirmationInfoComponentMap[
      currentConfirmation?.type as keyof typeof ConfirmationInfoComponentMap
    ]();

  return <InfoComponent />;
};

export default Info;

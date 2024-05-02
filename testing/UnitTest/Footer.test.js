import { render } from '@testing-library/react';
import Footer from './Footer'

describe(Footer , () => {
    it("reviews displays initial count", () => {
        const {getByTestId} = render(<Footer initialCount = {0}></Footer>);
        const countValue = Number(getByTestId("count").textContent);
        expect(countValue).toEqual(0);
    });
});